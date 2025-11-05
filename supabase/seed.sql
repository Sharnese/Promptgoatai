-- Insert categories
INSERT INTO public.prompt_categories (name) VALUES
  ('Clinical & Human Services'),
  ('Business & Admin'),
  ('Self-Reflection & Wellness'),
  ('AI Productivity & Writing'),
  ('Compliance & Operations');

-- Insert sample prompts
INSERT INTO public.prompts (category_id, title, description, body, is_premium) VALUES
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Clinical & Human Services'),
    'Client Intake Summary',
    'Generate comprehensive intake summaries for new clients',
    'Create a detailed intake summary for a new client including: presenting concerns, background history, assessment results, and recommended treatment plan. Use empathetic language and maintain professional clinical standards.',
    false
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Business & Admin'),
    'Meeting Minutes Generator',
    'Transform meeting notes into structured minutes',
    'Convert these meeting notes into professional meeting minutes with: attendees, agenda items discussed, key decisions made, action items with owners, and next meeting date.',
    false
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Self-Reflection & Wellness'),
    'Daily Gratitude Journal',
    'Guided prompts for gratitude practice',
    'Guide me through a daily gratitude practice. Ask me to reflect on: 3 things I''m grateful for today, why they matter to me, and how I can cultivate more of these positive experiences.',
    false
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'AI Productivity & Writing'),
    'Email Response Template',
    'Professional email responses for common scenarios',
    'Draft a professional email response to [SCENARIO]. Tone should be [TONE: friendly/formal/apologetic]. Include: acknowledgment of their message, clear response to their request, and next steps.',
    false
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Compliance & Operations'),
    'Policy Document Review',
    'Review policy documents for compliance',
    'Review this policy document for: clarity, compliance with current regulations, potential gaps, and recommendations for improvement. Provide specific suggestions with rationale.',
    false
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Clinical & Human Services'),
    'Treatment Plan Builder',
    'Create evidence-based treatment plans',
    'Develop a comprehensive treatment plan including: diagnosis, long-term goals, short-term objectives (SMART format), evidence-based interventions, frequency of sessions, progress measurement criteria, and discharge criteria. Ensure cultural competence and client-centered approach.',
    true
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Business & Admin'),
    'Strategic SWOT Analysis',
    'Generate detailed SWOT analysis for business planning',
    'Conduct a comprehensive SWOT analysis for [COMPANY/PROJECT]. Analyze: internal strengths and weaknesses, external opportunities and threats, strategic implications, and actionable recommendations. Include market trends and competitive positioning.',
    true
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Self-Reflection & Wellness'),
    'Cognitive Reframing Exercise',
    'Transform negative thought patterns',
    'Guide me through cognitive reframing of [NEGATIVE THOUGHT]. Help me: identify cognitive distortions, challenge the thought with evidence, generate alternative perspectives, and create a balanced, realistic thought. Use CBT principles.',
    true
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'AI Productivity & Writing'),
    'Content Marketing Calendar',
    'Plan 30-day content strategy with SEO optimization',
    'Create a 30-day content marketing calendar for [INDUSTRY/NICHE]. Include: daily post topics, content formats (blog/video/social), target keywords, audience pain points addressed, CTAs, and cross-promotion strategy. Optimize for SEO and engagement.',
    true
  ),
  (
    (SELECT id FROM public.prompt_categories WHERE name = 'Compliance & Operations'),
    'Risk Assessment Matrix',
    'Comprehensive risk analysis and mitigation planning',
    'Develop a risk assessment matrix for [PROJECT/OPERATION]. Identify: potential risks, likelihood (1-5), impact (1-5), risk score, mitigation strategies, contingency plans, responsible parties, and monitoring procedures. Include both operational and strategic risks.',
    true
  );
