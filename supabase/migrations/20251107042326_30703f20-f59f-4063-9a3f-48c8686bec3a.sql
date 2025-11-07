-- Tabela de conquistas/achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL, -- 'streak', 'meals_logged', 'recipes_created', etc
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de conquistas dos usuários
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Tabela de desafios diários
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  challenge_type TEXT NOT NULL, -- 'log_breakfast', 'drink_water', 'exercise', etc
  description TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_date, challenge_type)
);

-- Tabela de progresso físico
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de refeições logadas
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  meal_name TEXT NOT NULL,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fats DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de preferências de IA melhorada
CREATE TABLE IF NOT EXISTS public.user_ai_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dietary_restrictions TEXT[], -- ['vegetarian', 'gluten-free', etc]
  allergies TEXT[],
  favorite_cuisines TEXT[], -- ['italian', 'japanese', 'brazilian', etc]
  disliked_ingredients TEXT[],
  calorie_goal INTEGER,
  protein_goal DECIMAL(5,2),
  carb_goal DECIMAL(5,2),
  fat_goal DECIMAL(5,2),
  meal_complexity TEXT, -- 'simple', 'moderate', 'complex'
  cooking_time_preference TEXT, -- 'quick', 'moderate', 'any'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies para achievements (público para leitura)
CREATE POLICY "Anyone can view achievements"
ON public.achievements FOR SELECT
TO authenticated
USING (true);

-- RLS Policies para user_achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies para daily_challenges
CREATE POLICY "Users can view their own challenges"
ON public.daily_challenges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
ON public.daily_challenges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON public.daily_challenges FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies para user_progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies para meal_logs
CREATE POLICY "Users can view their own meal logs"
ON public.meal_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal logs"
ON public.meal_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal logs"
ON public.meal_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal logs"
ON public.meal_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies para user_ai_preferences
CREATE POLICY "Users can view their own AI preferences"
ON public.user_ai_preferences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI preferences"
ON public.user_ai_preferences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI preferences"
ON public.user_ai_preferences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Inserir conquistas iniciais
INSERT INTO public.achievements (name, description, icon, points, requirement_type, requirement_value) VALUES
('Primeira Semana', 'Complete sua primeira semana no WeekFit', '🔥', 50, 'streak', 7),
('Maratonista', 'Mantenha um streak de 30 dias', '🏃', 200, 'streak', 30),
('Chef Iniciante', 'Registre 10 refeições', '👨‍🍳', 30, 'meals_logged', 10),
('Mestre Culinário', 'Registre 100 refeições', '👨‍🍳', 150, 'meals_logged', 100),
('Viciado em Saúde', 'Mantenha um streak de 100 dias', '💪', 500, 'streak', 100),
('Explorador de Receitas', 'Experimente 20 receitas diferentes', '🔍', 80, 'recipes_tried', 20);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_ai_preferences
CREATE TRIGGER update_user_ai_preferences_updated_at
  BEFORE UPDATE ON public.user_ai_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();