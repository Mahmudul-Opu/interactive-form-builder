CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT NOT NULL DEFAULT '',

    slug TEXT NOT NULL UNIQUE,

    questions JSONB NOT NULL DEFAULT '[]'::jsonb,

    welcome_message TEXT NOT NULL
        DEFAULT 'Hello! Let us get started.',

    completion_message TEXT NOT NULL
        DEFAULT 'Thank you for your response!',

    primary_color TEXT NOT NULL DEFAULT '#6366f1',

    published BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    form_id UUID NOT NULL
        REFERENCES public.forms(id)
        ON DELETE CASCADE,

    answers JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS forms_user_id_idx
ON public.forms(user_id);

CREATE INDEX IF NOT EXISTS forms_slug_idx
ON public.forms(slug);

CREATE INDEX IF NOT EXISTS submissions_form_id_idx
ON public.submissions(form_id);

ALTER TABLE public.forms
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.submissions
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view their forms"
ON public.forms;

CREATE POLICY "Owners can view their forms"
ON public.forms
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view published forms"
ON public.forms;

CREATE POLICY "Public can view published forms"
ON public.forms
FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Users can create their forms"
ON public.forms;

CREATE POLICY "Users can create their forms"
ON public.forms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update their forms"
ON public.forms;

CREATE POLICY "Owners can update their forms"
ON public.forms
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can delete their forms"
ON public.forms;

CREATE POLICY "Owners can delete their forms"
ON public.forms
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can view submissions"
ON public.submissions;

CREATE POLICY "Owners can view submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.forms
        WHERE forms.id = submissions.form_id
        AND forms.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Public can submit published forms"
ON public.submissions;

CREATE POLICY "Public can submit published forms"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.forms
        WHERE forms.id = submissions.form_id
        AND forms.published = true
    )
);

CREATE OR REPLACE FUNCTION public.validate_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    form_questions JSONB;
    question JSONB;
    answer TEXT;
    question_id TEXT;
    question_type TEXT;
BEGIN
    SELECT questions
    INTO form_questions
    FROM public.forms
    WHERE id = NEW.form_id
      AND published = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Form is not published';
    END IF;

    IF jsonb_typeof(NEW.answers) IS DISTINCT FROM 'object' THEN
        RAISE EXCEPTION 'Answers must be an object';
    END IF;

    IF jsonb_typeof(form_questions) IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'Invalid form questions';
    END IF;

    FOR question IN
        SELECT value FROM jsonb_array_elements(form_questions)
    LOOP
        question_id := question->>'id';
        question_type := question->>'type';

        IF question_id IS NULL THEN
            RAISE EXCEPTION 'Invalid question ID';
        END IF;

        IF NEW.answers ? question_id THEN
            IF jsonb_typeof(NEW.answers->question_id) <> 'string' THEN
                RAISE EXCEPTION 'Answers must be strings';
            END IF;

            answer := NEW.answers->>question_id;
        ELSE
            answer := NULL;
        END IF;

        IF COALESCE((question->>'required')::boolean, false)
           AND (answer IS NULL OR btrim(answer) = '') THEN
            RAISE EXCEPTION 'A required answer is missing';
        END IF;

        IF answer IS NOT NULL AND btrim(answer) <> '' THEN

            IF length(answer) > 2000 THEN
                RAISE EXCEPTION 'Answer exceeds maximum length';
            END IF;

            IF question_type = 'email'
               AND answer !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
            THEN
                RAISE EXCEPTION 'Invalid email address';
            END IF;

            IF question_type = 'yes_no'
               AND answer NOT IN ('Yes', 'No')
            THEN
                RAISE EXCEPTION 'Invalid yes/no answer';
            END IF;

            IF question_type = 'multiple_choice'
               AND NOT EXISTS (
                   SELECT 1
                   FROM jsonb_array_elements_text(
                       COALESCE(question->'options', '[]'::jsonb)
                   ) AS option_value(value)
                   WHERE option_value.value = answer
               )
            THEN
                RAISE EXCEPTION 'Invalid multiple-choice answer';
            END IF;

        END IF;
    END LOOP;

    IF EXISTS (
        SELECT 1
        FROM jsonb_object_keys(NEW.answers) AS submitted(key)
        WHERE NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(form_questions) AS q(value)
            WHERE q.value->>'id' = submitted.key
        )
    ) THEN
        RAISE EXCEPTION 'Unknown question in submission';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_submission_trigger
ON public.submissions;

CREATE TRIGGER validate_submission_trigger
BEFORE INSERT ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.validate_submission();