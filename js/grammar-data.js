// ============================================================

//  grammar-data.js  –  English Coach
//  Grammar topics & lesson plan for Spanish-speaking beginners
//  title / intro / rules / examples in Spanish + English
// ============================================================

const grammarTopicsData = [

// ════════════════════════════════════════════════════════════
//  ══ A1 ══
// ════════════════════════════════════════════════════════════

  {
    id: 'subject-pronouns',
    level: 'A1',
    filter: 'pronouns',
    title: 'Pronombres personales sujeto',
    titleEn: 'Subject pronouns',
    intro: 'Los pronombres personales sujeto sustituyen al nombre de la persona que realiza la acción. En inglés son OBLIGATORIOS — nunca se puede omitir el sujeto.',
    introEn: 'Subject pronouns replace the name of the person doing the action. In English they are REQUIRED — you can never omit the subject.',
    tables: [
      {
        heading: 'Pronombres personales', headingEn: 'Subject pronouns',
        cols: ['Español', 'Inglés', 'Ejemplo', 'Traducción'],
        rows: [
          ['yo',                    'I',    'I am a student.',       'Soy estudiante.'],
          ['tú / usted',            'you',  'You are my teacher.',   'Tú eres mi profesor.'],
          ['él',                    'he',   'He is from Mexico.',    'Él es de México.'],
          ['ella',                  'she',  'She is my sister.',     'Ella es mi hermana.'],
          ['ello (cosas/animales)', 'it',   'It is my book.',        'Es mi libro.'],
          ['nosotros/as',           'we',   'We are from Spain.',    'Somos de España.'],
          ['vosotros / ustedes',    'you',  'You are my friends.',   'Ustedes son mis amigos.'],
          ['ellos / ellas',         'they', 'They are my parents.',  'Ellos son mis padres.'],
        ]
      },
      {
        heading: 'Pronombres + verbo "be" (am / is / are)', headingEn: 'Pronouns + verb "be" (am / is / are)',
        cols: ['Pronombre', 'Verbo', 'Ejemplo', 'Traducción'],
        rows: [
          ['I',          'am',  'I am happy.',            'Estoy contento/a.'],
          ['you',        'are', 'You are my friend.',     'Tú eres mi amigo.'],
          ['he',         'is',  'He is from Peru.',       'Él es de Perú.'],
          ['she',        'is',  'She is a doctor.',       'Ella es médica.'],
          ['it',         'is',  'It is my book.',         'Es mi libro.'],
          ['we',         'are', 'We are friends.',        'Somos amigos.'],
          ['you (pl.)',  'are', 'You are my family.',     'Ustedes son mi familia.'],
          ['they',       'are', 'They are from Colombia.','Ellos son de Colombia.'],
        ]
      }
    ],
    rules: [
      { nl: '"I" siempre se escribe con mayúscula, esté donde esté en la oración.',
        en: '"I" is always capitalised, wherever it appears in the sentence.' },
      { nl: '"You" se usa tanto para tú (singular) como para vosotros/ustedes (plural).',
        en: '"You" is used for both singular and plural second person.' },
      { nl: '"It" se usa para cosas y animales: It is my book. / It is a boy.',
        en: '"It" is used for things and animals: It is my book. / It is a boy.' },
      { nl: 'A diferencia del español, en inglés NUNCA se puede omitir el sujeto: "Is raining" es incorrecto; debes decir "It is raining".',
        en: 'Unlike Spanish, in English you can NEVER omit the subject: "Is raining" is wrong; you must say "It is raining".' },
      { nl: '"am" solo se usa con "I". "is" se usa con he/she/it (singular). "are" se usa con you/we/they (plural).',
        en: '"am" is only used with "I". "is" is used with he/she/it (singular). "are" is used with you/we/they (plural).' },
    ],
    examples: [
      { nl: 'I am a student.',           en: 'Soy estudiante.' },
      { nl: 'You are my friend.',        en: 'Tú eres mi amigo.' },
      { nl: 'He is from England.',       en: 'Él es de Inglaterra.' },
      { nl: 'She has two brothers.',     en: 'Ella tiene dos hermanos.' },
      { nl: 'They are my parents.',      en: 'Ellos son mis padres.' },
    ],
    tip: 'En español puedes decir "Soy estudiante", pero en inglés SIEMPRE necesitas el pronombre: "I am a student".',
    tipEn: 'In Spanish you can say "Soy estudiante", but in English you ALWAYS need the pronoun: "I am a student".',
  },

  {
    id: 'verb-to-be',
    level: 'A1',
    filter: 'verb-be',
    title: 'El verbo "to be" (ser / estar)',
    titleEn: 'The verb "to be"',
    intro: 'El verbo "to be" equivale tanto a "ser" como a "estar" en español. Es el verbo más importante del inglés y se usa para identidades, descripciones y estados.',
    introEn: 'The verb "to be" covers both "ser" and "estar" in Spanish. It is the most important English verb, used for identities, descriptions and states.',
    tables: [
      {
        heading: 'Formas afirmativas y contracciones', headingEn: 'Affirmative forms and contractions',
        cols: ['Pronombre', 'Forma plena', 'Contracción'],
        rows: [
          ['I',    'I am',    "I'm"],
          ['you',  'you are', "you're"],
          ['he',   'he is',   "he's"],
          ['she',  'she is',  "she's"],
          ['it',   'it is',   "it's"],
          ['we',   'we are',  "we're"],
          ['they', 'they are',"they're"],
        ]
      },
      {
        heading: 'Formas negativas', headingEn: 'Negative forms',
        cols: ['Pronombre', 'Forma plena', 'Contracción'],
        rows: [
          ['I',    'I am not',     "I'm not"],
          ['you',  'you are not',  "you aren't"],
          ['he',   'he is not',    "he isn't"],
          ['she',  'she is not',   "she isn't"],
          ['it',   'it is not',    "it isn't"],
          ['we',   'we are not',   "we aren't"],
          ['they', 'they are not', "they aren't"],
        ]
      },
      {
        heading: 'Preguntas (inversión)', headingEn: 'Questions (inversion)',
        cols: ['Pregunta', 'Respuesta sí', 'Respuesta no'],
        rows: [
          ['Am I ...?',     'Yes, you are.',  "No, you aren't."],
          ['Are you ...?',  'Yes, I am.',     "No, I'm not."],
          ['Is he ...?',    'Yes, he is.',    "No, he isn't."],
          ['Is she ...?',   'Yes, she is.',   "No, she isn't."],
          ['Are we ...?',   'Yes, we are.',   "No, we aren't."],
          ['Are they ...?', 'Yes, they are.', "No, they aren't."],
        ]
      }
    ],
    rules: [
      { nl: 'Afirmativa: sujeto + am/is/are + complemento.',
        en: 'Affirmative: subject + am/is/are + complement.' },
      { nl: 'Negativa: sujeto + am/is/are + not + complemento.',
        en: 'Negative: subject + am/is/are + not + complement.' },
      { nl: 'Pregunta: am/is/are + sujeto + complemento + ?',
        en: 'Question: am/is/are + subject + complement + ?' },
      { nl: 'Con profesiones se usa artículo: "She is a teacher" (nunca "She is teacher").',
        en: 'With jobs always use an article: "She is a teacher" (never "She is teacher").' },
    ],
    examples: [
      { nl: 'I am a teacher.',             en: 'Soy profesora.' },
      { nl: 'I am not tired.',             en: 'No estoy cansado.' },
      { nl: 'Is she your sister?',         en: '¿Es ella tu hermana?' },
      { nl: 'They are from Argentina.',    en: 'Ellos son de Argentina.' },
      { nl: 'Are you OK?',                 en: '¿Estás bien?' },
    ],
    tip: '"To be" NO usa auxiliar "do/does" para preguntas y negaciones. Simplemente invierte el verbo o añade "not".',
    tipEn: '"To be" does NOT use the auxiliary "do/does" for questions and negatives. Just invert or add "not".',
  },

  {
    id: 'articles',
    level: 'A1',
    filter: 'articles',
    title: 'Artículos: a, an, the',
    titleEn: 'Articles: a, an, the',
    intro: 'En inglés hay artículo indeterminado (a/an) para mencionar algo por primera vez o de forma general, y artículo determinado (the) para referirse a algo específico o ya conocido.',
    introEn: 'English has the indefinite article (a/an) used for first mentions or general statements, and the definite article (the) for something specific or already known.',
    tables: [
      {
        heading: 'Cuándo usar cada artículo', headingEn: 'When to use each article',
        cols: ['Artículo', 'Uso', 'Ejemplo', 'Traducción'],
        rows: [
          ['a',   'Antes de sonido consonántico, primera mención, singular contable', 'I have a brother.', 'Tengo un hermano.'],
          ['an',  'Antes de sonido vocálico (a, e, i, o, u)', 'She is an old woman.', 'Ella es una mujer vieja.'],
          ['the', 'Referencia específica, único en su clase, ya mencionado', 'The father is good.', 'El padre es bueno.'],
          ['—',   'Sin artículo: plural general, incontables en general, nombres propios', 'I like Mondays.', 'Me gustan los lunes.'],
        ]
      }
    ],
    rules: [
      { nl: 'Usa "a" o "an" según el SONIDO inicial de la siguiente palabra, no la letra escrita.',
        en: 'Use "a" or "an" based on the SOUND of the next word, not the spelling.' },
      { nl: '"University" → "a university" (suena /juː/, consonante). "Hour" → "an hour" (h muda).',
        en: '"University" → "a university" (/juː/ sound = consonant). "Hour" → "an hour" (silent h).' },
      { nl: 'Con profesiones siempre se usa artículo en inglés: "He is a doctor".',
        en: 'With jobs always use an article in English: "He is a doctor".' },
      { nl: 'Sin artículo para gustos generales en plural: "I like Saturdays" (no "I like the Saturdays").',
        en: 'No article for general likes in plural: "I like Saturdays" (not "I like the Saturdays").' },
    ],
    examples: [
      { nl: 'I have a brother and a sister.',      en: 'Tengo un hermano y una hermana.' },
      { nl: 'She is an old woman.',                en: 'Es una mujer vieja.' },
      { nl: 'The morning is beautiful.',           en: 'La mañana es bonita.' },
      { nl: 'He is a good father.',                en: 'Él es un buen padre.' },
      { nl: 'I need an easy book.',                en: 'Necesito un libro fácil.' },
    ],
    tip: 'La elección a/an depende del SONIDO, no de la letra. Practica diciendo las palabras en voz alta.',
    tipEn: 'The choice of a/an depends on the SOUND, not the letter. Practice saying the words out loud.',
  },

  {
    id: 'present-simple',
    level: 'A1',
    filter: 'tenses',
    title: 'Presente simple',
    titleEn: 'Present simple',
    intro: 'El presente simple se usa para hábitos, rutinas, hechos generales y verdades permanentes. Para he/she/it el verbo añade -s o -es.',
    introEn: 'The present simple is used for habits, routines, general facts and permanent truths. For he/she/it, the verb adds -s or -es.',
    tables: [
      {
        heading: 'Conjugación — verbo "work"', headingEn: 'Conjugation — verb "work"',
        cols: ['Pronombre', 'Verbo', 'Ejemplo', 'Traducción'],
        rows: [
          ['I',    'work',  'I work every morning.',     'Trabajo todas las mañanas.'],
          ['you',  'work',  'You work on Mondays.',      'Trabajas los lunes.'],
          ['he',   'works', 'He works with his father.', 'Él trabaja con su padre.'],
          ['she',  'works', 'She works every week.',     'Ella trabaja cada semana.'],
          ['it',   'works', 'It works well.',            'Funciona bien.'],
          ['we',   'work',  'We work every day.',        'Trabajamos todos los días.'],
          ['they', 'work',  'They work in the morning.', 'Ellos trabajan por la mañana.'],
        ]
      },
      {
        heading: 'Reglas de la -s (3ª persona singular)', headingEn: '-s rules (3rd person singular)',
        cols: ['Terminación', 'Cómo se forma', 'Ejemplo'],
        rows: [
          ['mayoría de verbos',      'añade -s',  'work → works, eat → eats'],
          ['-s, -sh, -ch, -x, -o',  'añade -es', 'go → goes, watch → watches'],
          ['consonante + y',         'y → ies',   'study → studies, fly → flies'],
          ['vocal + y',              'añade -s',  'play → plays, say → says'],
        ]
      },
      {
        heading: 'Preguntas y negaciones', headingEn: 'Questions and negatives',
        cols: ['Tipo', 'Estructura', 'Ejemplo', 'Traducción'],
        rows: [
          ['Pregunta (I/you/we/they)', 'Do + sujeto + verbo base + ?',    'Do you work here?',      '¿Trabajas aquí?'],
          ['Pregunta (he/she/it)',     'Does + sujeto + verbo base + ?',  'Does she work here?',    '¿Ella trabaja aquí?'],
          ['Negación (I/you/we/they)', "sujeto + don't + verbo base",     "I don't work Sundays.",  'No trabajo los domingos.'],
          ['Negación (he/she/it)',     "sujeto + doesn't + verbo base",   "He doesn't work today.", 'Él no trabaja hoy.'],
        ]
      }
    ],
    rules: [
      { nl: 'Con "does/doesn\'t" el verbo vuelve a la forma base: "She doesn\'t work" (nunca "works").',
        en: 'With "does/doesn\'t" the verb returns to base form: "She doesn\'t work" (never "works").' },
      { nl: 'Adverbios de frecuencia (always, usually, often, sometimes, never) van antes del verbo.',
        en: 'Frequency adverbs (always, usually, often, sometimes, never) go before the main verb.' },
      { nl: 'Para "be" nunca uses "do/does": "Are you tired?" (no: "Do you be tired?").',
        en: 'For "be" never use "do/does": "Are you tired?" (not: "Do you be tired?").' },
    ],
    examples: [
      { nl: 'My father works every morning.',     en: 'Mi padre trabaja todas las mañanas.' },
      { nl: 'She studies English on Mondays.',     en: 'Ella estudia inglés los lunes.' },
      { nl: 'Do you live with your family?',       en: '¿Vives con tu familia?' },
      { nl: 'My grandmother has a big family.',     en: 'Mi abuela tiene una familia grande.' },
      { nl: 'He likes new books.',                 en: 'Le gustan los libros nuevos.' },
    ],
    tip: 'Cuidado con la 3ª persona: la -s ya está en "does", así que el verbo principal NO lleva -s: "She doesn\'t work" (nunca "doesn\'t works").',
    tipEn: 'Watch the 3rd person: the -s is already in "does", so the main verb takes NO extra -s: "She doesn\'t work" (never "doesn\'t works").',
  },

  {
    id: 'negation',
    level: 'A1',
    filter: 'negation',
    title: "La negación: don't / doesn't / isn't / aren't",
    titleEn: "Negation: don't / doesn't / isn't / aren't",
    intro: "Para negar verbos en presente simple se usa \"don't\" o \"doesn't\". Para negar \"to be\" solo se añade \"not\" después del verbo.",
    introEn: 'To make present simple negatives, use "don\'t" or "doesn\'t". To negate "to be", simply add "not" after the verb.',
    tables: [
      {
        heading: 'Negación con do/does', headingEn: 'Negation with do/does',
        cols: ['Sujeto', 'Negación', 'Ejemplo', 'Traducción'],
        rows: [
          ['I / you / we / they', "don't (do not)",    "I don't like fish.",           'No me gusta el pescado.'],
          ['he / she / it',       "doesn't (does not)", "She doesn't drink tea.",     'Ella no bebe té.'],
        ]
      },
      {
        heading: 'Negación con be', headingEn: 'Negation with be',
        cols: ['Sujeto', 'Negación', 'Contracción', 'Ejemplo', 'Traducción'],
        rows: [
          ['I',          'am not',  "I'm not",   "I'm not hungry.",     'No tengo hambre.'],
          ['you',        'are not', "aren't",    "You aren't sad.",    'No estás triste.'],
          ['he/she/it',  'is not',  "isn't",     "It isn't cold.",     'No hace frío.'],
          ['we/they',    'are not', "aren't",    "They aren't happy.", 'No están contentos.'],
        ]
      }
    ],
    rules: [
      { nl: "Con todos los verbos (excepto 'be'): sujeto + don't/doesn't + verbo base.",
        en: "With all verbs (except 'be'): subject + don't/doesn't + base verb." },
      { nl: "Con 'be': sujeto + am/is/are + not. Nunca uses 'don't' con 'be'.",
        en: "With 'be': subject + am/is/are + not. Never use 'don't' with 'be'." },
      { nl: "La contracción (don't, doesn't, isn't) suena más natural en conversación.",
        en: "The contracted form (don't, doesn't, isn't) sounds more natural in conversation." },
      { nl: "Error frecuente: 'She don't know' — incorrecto. Con he/she/it usa SIEMPRE 'doesn't'.",
        en: "Common mistake: 'She don't know' — wrong. For he/she/it ALWAYS use 'doesn't'." },
    ],
    examples: [
      { nl: "I don't like fish.",            en: 'No me gusta el pescado.' },
      { nl: "She doesn't drink coffee.",     en: 'Ella no bebe café.' },
      { nl: "The shirt isn't blue.",         en: 'La camiseta no es azul.' },
      { nl: "I don't eat sugar.",            en: 'No como azúcar.' },
      { nl: "He doesn't wear a jacket.",     en: 'Él no lleva chaqueta.' },
    ],
    tip: "Recuerda: solo hay DOS patrones de negación — con 'be': añade 'not'. Con todos los demás verbos: usa 'don't / doesn't'.",
    tipEn: "Remember: there are only TWO negation patterns — with 'be': add 'not'. With all other verbs: use 'don't / doesn't'.",
  },

  {
    id: 'question-words',
    level: 'A1',
    filter: 'question',
    title: 'Palabras interrogativas (WH-questions)',
    titleEn: 'Question words (WH-questions)',
    intro: 'Las palabras interrogativas (what, where, who, when, how, why) van al inicio de la pregunta, seguidas del auxiliar y el sujeto.',
    introEn: 'Question words (what, where, who, when, how, why) come at the start, followed by the auxiliary and subject.',
    tables: [
      {
        heading: 'Palabras interrogativas', headingEn: 'Question words',
        cols: ['Inglés', 'Español', 'Ejemplo', 'Traducción'],
        rows: [
          ['what',       '¿qué? / ¿cuál?',    'What do you eat for breakfast?',  '¿Qué comes para desayunar?'],
          ['where',      '¿dónde?',           'Where do you buy your shoes?',    '¿Dónde compras tus zapatos?'],
          ['who',        '¿quién?',           'Who has the red bag?',            '¿Quién tiene el bolso rojo?'],
          ['when',       '¿cuándo?',          'When do you drink coffee?',       '¿Cuándo bebes café?'],
          ['why',        '¿por qué?',         'Why do you like green?',          '¿Por qué te gusta el verde?'],
          ['how',        '¿cómo?',            'How do you like your tea?',       '¿Cómo te gusta el té?'],
          ['how many',   '¿cuántos/as?',      'How many eggs do you want?',      '¿Cuántos huevos quieres?'],
          ['how much',   '¿cuánto/a?',        'How much milk do you need?',      '¿Cuánta leche necesitas?'],
          ['how old',    '¿cuántos años?',    'How old are you?',                '¿Cuántos años tienes?'],
          ['which',      '¿cuál? (de varios)','Which colour do you prefer?',     '¿Qué color prefieres?'],
        ]
      },
      {
        heading: 'Estructura de la pregunta', headingEn: 'Question structure',
        cols: ['Elemento', 'Ejemplo'],
        rows: [
          ['WH-word',       'Where'],
          ['Auxiliar',      'do'],
          ['Sujeto',        'you'],
          ['Verbo base',    'buy your shoes?'],
          ['Oración completa', 'Where do you buy your shoes?'],
        ]
      }
    ],
    rules: [
      { nl: 'Estructura: WH-word + auxiliar (do/does/is/are) + sujeto + verbo base.',
        en: 'Structure: WH-word + auxiliary (do/does/is/are) + subject + base verb.' },
      { nl: 'Si "who" o "what" ES el sujeto, no se usa auxiliar: Who lives here? (no: Who does live here?)',
        en: 'If "who" or "what" IS the subject, no auxiliary is needed: Who lives here? (not: Who does live here?)' },
      { nl: '"How" se combina con adjetivos: How long? How often? How far? How old?',
        en: '"How" combines with adjectives: How long? How often? How far? How old?' },
      { nl: 'Con "be": WH-word + is/are + sujeto: Where is she? / What are they?',
        en: 'With "be": WH-word + is/are + subject: Where is she? / What are they?' },
    ],
    examples: [
      { nl: 'What colour is your shirt?',         en: '¿De qué color es tu camiseta?' },
      { nl: 'Where do you buy your clothes?',      en: '¿Dónde compras tu ropa?' },
      { nl: 'What do you eat for breakfast?',      en: '¿Qué comes para desayunar?' },
      { nl: 'When do you drink coffee?',           en: '¿Cuándo bebes café?' },
      { nl: 'Who has the red bag?',                en: '¿Quién tiene el bolso rojo?' },
    ],
    tip: 'Piensa en la estructura como un bloque fijo: WH + auxiliar + sujeto + verbo. La WH-word indica qué información buscas.',
    tipEn: 'Think of the structure as a fixed block: WH + auxiliary + subject + verb. The WH-word signals what information you need.',
  },

  {
    id: 'there-is-are',
    level: 'A1',
    filter: 'there-is',
    title: 'There is / There are (Hay)',
    titleEn: 'There is / There are',
    intro: 'Usamos "there is" y "there are" para indicar la existencia o presencia de algo. Equivale al "hay" del español.',
    introEn: 'We use "there is" and "there are" to indicate the existence or presence of something. It is the English equivalent of Spanish "hay".',
    tables: [
      {
        heading: 'Afirmativa, negativa, interrogativa', headingEn: 'Affirmative, negative, question',
        cols: ['Forma', 'Singular (traducción)', 'Plural (traducción)'],
        rows: [
          ['Afirmativa',     'There is a book. (Hay un libro.)',             'There are three books. (Hay tres libros.)'],
          ['Negativa',       "There isn't a book. (No hay un libro.)",       "There aren't any books. (No hay libros.)"],
          ['Interrogativa',  'Is there a book? (¿Hay un libro?)',            'Are there any books? (¿Hay libros?)'],
          ['Resp. sí',       'Yes, there is. (Sí, hay.)',                    'Yes, there are. (Sí, hay.)'],
          ['Resp. no',       "No, there isn't. (No, no hay.)",               "No, there aren't. (No, no hay.)"],
        ]
      },
      {
        heading: 'Some vs. any', headingEn: 'Some vs. any',
        cols: ['Palabra', 'Uso', 'Ejemplo', 'Traducción'],
        rows: [
          ['some', 'Afirmativas y peticiones/ofertas',  'There are some chairs.',                          'Hay algunas sillas.'],
          ['any',  'Negativas y preguntas neutras',     "Are there any chairs? / There aren't any chairs.","¿Hay sillas? / No hay sillas."],
        ]
      }
    ],
    rules: [
      { nl: '"There is" con singular y sustantivos incontables; "there are" con plural.',
        en: '"There is" with singular and uncountable nouns; "there are" with plurals.' },
      { nl: 'La negación puede ser "There is no + noun" o "There isn\'t a/any + noun".',
        en: 'The negative can be "There is no + noun" or "There isn\'t a/any + noun".' },
      { nl: 'En preguntas, "be" se invierte: Is there...? / Are there...?',
        en: 'In questions, "be" inverts: Is there...? / Are there...?' },
      { nl: '"There" en esta estructura no significa "allí" — es un sujeto gramatical sin referente.',
        en: '"There" here does not mean the place "there" — it is a grammatical placeholder subject.' },
    ],
    examples: [
      { nl: 'There is a table in the kitchen.',          en: 'Hay una mesa en la cocina.' },
      { nl: 'There are two cars on the road.',           en: 'Hay dos coches en la carretera.' },
      { nl: 'There is no bus at the station.',           en: 'No hay autobús en la estación.' },
      { nl: 'Is there a garden in your house?',          en: '¿Hay un jardín en tu casa?' },
      { nl: 'Are there any chairs in the bedroom?',      en: '¿Hay sillas en el dormitorio?' },
    ],
    tip: 'En inglés "hay" siempre se expresa con "there is/are". Nunca uses "it is" para traducir "hay".',
    tipEn: 'In English "hay" is always expressed as "there is/are". Never use "it is" to translate "hay".',
  },

// ════════════════════════════════════════════════════════════
//  ══ A2 ══
// ════════════════════════════════════════════════════════════

  {
    id: 'present-continuous',
    level: 'A2',
    filter: 'tenses',
    title: 'Presente continuo (be + verbo-ing)',
    titleEn: 'Present continuous (be + verb-ing)',
    intro: 'El presente continuo se forma con el verbo "be" conjugado + infinitivo con -ing. Se usa para acciones que ocurren ahora mismo o en un período de tiempo presente.',
    introEn: 'The present continuous is formed with conjugated "be" + infinitive with -ing. Used for actions happening right now or around the present time.',
    tables: [
      {
        heading: 'Formación: be + verb-ing', headingEn: 'Formation: be + verb-ing',
        cols: ['Pronombre', 'be', 'verbo-ing', 'Ejemplo', 'Traducción'],
        rows: [
          ['I',    'am',  'washing',  'I am washing my face.',          'Estoy lavándome la cara.'],
          ['you',  'are', 'moving',   'You are moving your arm.',       'Estás moviendo tu brazo.'],
          ['he',   'is',  'reading',  'He is reading a big book.',      'Él está leyendo un libro grande.'],
          ['she',  'is',  'touching', 'She is touching her nose.',      'Ella se está tocando la nariz.'],
          ['it',   'is',  'getting',  'It is getting cold.',            'Se está poniendo frío.'],
          ['we',   'are', 'learning', 'We are learning new words.',     'Estamos aprendiendo palabras nuevas.'],
          ['they', 'are', 'running',  'They are running fast.',         'Ellos están corriendo rápido.'],
        ]
      },
      {
        heading: 'Ortografía del -ing', headingEn: '-ing spelling rules',
        cols: ['Regla', 'Ejemplo'],
        rows: [
          ['La mayoría: añade -ing',                          'work → working, eat → eating'],
          ['Termina en -e: quita la -e y añade -ing',         'write → writing, make → making'],
          ['CVC corto (consonante-vocal-consonante): dobla la última consonante', 'run → running, sit → sitting'],
          ['-ie al final: cambia a -y + ing',                 'die → dying, lie → lying'],
        ]
      }
    ],
    rules: [
      { nl: 'Señales de tiempo: now, right now, at the moment, today, this week.',
        en: 'Time signals: now, right now, at the moment, today, this week.' },
      { nl: 'Verbos de estado (know, like, love, want, need) NO se usan normalmente en continuo.',
        en: 'State verbs (know, like, love, want, need) are NOT normally used in the continuous.' },
      { nl: 'Diferencia clave: "I work" (hábito) vs. "I am working" (ahora mismo).',
        en: 'Key difference: "I work" (habit) vs. "I am working" (right now).' },
      { nl: 'Negación: sujeto + be + not + verbo-ing: "I\'m not sleeping."',
        en: 'Negative: subject + be + not + verb-ing: "I\'m not sleeping."' },
    ],
    examples: [
      { nl: 'I am washing my hands now.',          en: 'Estoy lavándome las manos ahora.' },
      { nl: 'She is touching her head.',           en: 'Ella se está tocando la cabeza.' },
      { nl: 'My leg is hurting right now.',        en: 'Me duele la pierna ahora mismo.' },
      { nl: 'We are learning new, difficult words.', en: 'Estamos aprendiendo palabras nuevas y difíciles.' },
      { nl: 'He is running very fast.',            en: 'Él está corriendo muy rápido.' },
    ],
    tip: 'El presente continuo suele ir acompañado de "now", "at the moment" o "right now". Sin esas señales podría ser presente simple.',
    tipEn: 'The present continuous is usually signalled by "now", "at the moment" or "right now". Without those, it could be present simple.',
  },

  {
    id: 'simple-past',
    level: 'A2',
    filter: 'tenses',
    title: 'Pasado simple',
    titleEn: 'Simple past',
    intro: 'El pasado simple se usa para acciones completadas en el pasado. Los verbos regulares añaden -ed; los irregulares tienen formas propias que hay que memorizar.',
    introEn: 'The simple past is used for completed actions in the past. Regular verbs add -ed; irregular verbs have their own forms to memorise.',
    tables: [
      {
        heading: 'Verbos regulares: añadir -ed', headingEn: 'Regular verbs: add -ed',
        cols: ['Regla', 'Ejemplo'],
        rows: [
          ['mayoría de verbos: + ed',             'work → worked, play → played'],
          ['termina en -e: + d',                  'live → lived, love → loved'],
          ['consonante + y: y → ied',             'study → studied, try → tried'],
          ['CVC corto: dobla consonante final + ed', 'travel → travelled, listen → listened'],
        ]
      },
      {
        heading: 'Verbos irregulares frecuentes', headingEn: 'Common irregular verbs',
        cols: ['Infinitivo', 'Pasado', 'Traducción'],
        rows: [
          ['be',    'was / were', 'ser / estar'],
          ['have',  'had',        'tener'],
          ['go',    'went',       'ir'],
          ['do',    'did',        'hacer'],
          ['see',   'saw',        'ver'],
          ['come',  'came',       'venir'],
          ['get',   'got',        'obtener'],
          ['make',  'made',       'hacer'],
          ['eat',   'ate',        'comer'],
          ['drink', 'drank',      'beber'],
        ]
      },
      {
        heading: 'Preguntas y negaciones en pasado', headingEn: 'Past questions and negatives',
        cols: ['Tipo', 'Estructura', 'Ejemplo', 'Traducción'],
        rows: [
          ['Pregunta',  'Did + sujeto + verbo base + ?',    'Did you work yesterday?',   '¿Trabajaste ayer?'],
          ['Negación',  "sujeto + didn't + verbo base",     "I didn't work yesterday.",  'No trabajé ayer.'],
          ['Con "be" (pregunta)', 'Was/Were + sujeto + ?',   'Were you at home?',         '¿Estabas en casa?'],
          ['Con "be" (negación)', "sujeto + wasn't/weren't", "She wasn't at home.",       'Ella no estaba en casa.'],
        ]
      }
    ],
    rules: [
      { nl: 'En preguntas y negaciones con "did", el verbo vuelve al infinitivo: "Did she go?" (no "went").',
        en: 'In questions and negatives with "did", the verb returns to base form: "Did she go?" (not "went").' },
      { nl: 'Señales de tiempo: yesterday, last week, last year, in 2020, ago, when I was young.',
        en: 'Time signals: yesterday, last week, last year, in 2020, ago, when I was young.' },
      { nl: '"Be" en pasado es "was" (I/he/she/it) y "were" (you/we/they).',
        en: '"Be" in the past is "was" (I/he/she/it) and "were" (you/we/they).' },
    ],
    examples: [
      { nl: 'Yesterday I went to the supermarket.',    en: 'Ayer fui al supermercado.' },
      { nl: 'She ate chicken and rice last night.',    en: 'Ella comió pollo y arroz anoche.' },
      { nl: 'Did you take the bus yesterday?',         en: '¿Tomaste el autobús ayer?' },
      { nl: "I didn't eat breakfast this morning.",    en: 'No desayuné esta mañana.' },
      { nl: 'We went to the airport last week.',       en: 'Fuimos al aeropuerto la semana pasada.' },
    ],
    tip: 'La clave del pasado simple: ¿la acción está COMPLETADA? Si sí, usa pasado simple. Si sigue en progreso, usa continuo.',
    tipEn: 'The key to simple past: is the action COMPLETED? If yes, use simple past. If it was still in progress, use past continuous.',
  },

];

// ════════════════════════════════════════════════════════════
//  lessonPlanData  –  6 units across A1 (weeks 1-8) and A2 (weeks 9-12)
// ════════════════════════════════════════════════════════════
const lessonPlanData = {
  title: 'Plan de estudio de inglés A1–A2',
  titleEn: 'English Study Plan A1–A2',
  intro: 'Un plan estructurado de 12 semanas para pasar de A1 a A2 usando todas las herramientas de esta app.',
  introEn: 'A structured 12-week plan to go from A1 to A2 using all the tools in this app.',
  levels: [

    {
      level: 'A1',
      title: 'Principiante',
      duration: '8 semanas',
      durationEn: '8 weeks',
      color: '#276047',
      units: [
        {
          unit: 1,
          title: 'Saludos e introducciones',
          titleEn: 'Greetings and introductions',
          weeks: 'Semana 1–2',
          grammarTopics: ['subject-pronouns', 'verb-to-be'],
          verbFocus: ['be', 'have', 'do'],
          vocabTopics: [
            { level: 'A1', topic: 'greetings' },
            { level: 'A1', topic: 'personal' },
            { level: 'A1', topic: 'countries' },
            { level: 'A1', topic: 'emotions' },
            { level: 'A1', topic: 'family' },
            { level: 'A1', topic: 'numbers' },
          ],
          sentenceFilter: 'Statement',
          activities: [
            { type: 'woordenschat', desc: 'Aprender vocabulario de saludos, datos personales, países, familia y los números del 1 al 20.' },
            { type: 'grammatica',   desc: 'Estudiar los pronombres personales sujeto y cuándo usar am, is, are.' },
            { type: 'grammatica',   desc: 'Estudiar el verbo "to be" — formas y contracciones.' },
            { type: 'zinnen',       desc: 'Practicar frases de presentación y saludos.' },
            { type: 'werkwoorden',  desc: 'Conjugar be, have y do.' },
          ],
          goals: [
            'Presentarte y saludar a alguien en inglés',
            'Usar los pronombres personales correctamente',
            'Saber cuándo usar am, is y are con cada pronombre',
            'Conjugar el verbo "to be" en afirmativa, negativa y pregunta',
            'Conocer los números del 1 al 20 en inglés',
            'Preguntar y responder sobre datos personales básicos',
          ],
        },

        {
          unit: 2,
          title: 'Familia y vida diaria',
          titleEn: 'Family and daily life',
          weeks: 'Semana 3–4',
          grammarTopics: ['articles', 'present-simple'],
          verbFocus: ['have', 'work', 'live', 'study', 'like'],
          vocabTopics: [
            { level: 'A1', topic: 'family' },
            { level: 'A1', topic: 'time' },
            { level: 'A1', topic: 'adjective' },
          ],
          sentenceFilter: 'Statement',
          activities: [
            { type: 'woordenschat', desc: 'Aprender vocabulario de familia, tiempo y adjetivos.' },
            { type: 'grammatica',   desc: 'Estudiar los artículos a / an / the.' },
            { type: 'grammatica',   desc: 'Estudiar el presente simple y la regla de la -s.' },
            { type: 'zinnen',       desc: 'Practicar frases de rutina diaria y familia.' },
            { type: 'werkwoorden',  desc: 'Conjugar verbos de rutina: work, live, study.' },
          ],
          goals: [
            'Hablar sobre tu familia y vida diaria',
            'Usar los artículos a/an/the correctamente',
            'Conjugar verbos regulares en presente simple',
            'Aplicar la regla de la 3ª persona del singular (-s/-es)',
          ],
        },

        {
          unit: 3,
          title: 'Preguntas y negaciones',
          titleEn: 'Questions and negatives',
          weeks: 'Semana 5–6',
          grammarTopics: ['negation', 'question-words'],
          verbFocus: ['go', 'come', 'eat', 'drink', 'watch', 'play'],
          vocabTopics: [
            { level: 'A1', topic: 'food' },
            { level: 'A1', topic: 'colours' },
            { level: 'A1', topic: 'clothing' },
          ],
          sentenceFilter: 'Question',
          activities: [
            { type: 'woordenschat', desc: 'Aprender vocabulario de comida, colores y ropa.' },
            { type: 'grammatica',   desc: 'Estudiar la negación: don\'t, doesn\'t, isn\'t, aren\'t.' },
            { type: 'grammatica',   desc: 'Estudiar las palabras interrogativas (WH-questions).' },
            { type: 'zinnen',       desc: 'Practicar preguntas y negaciones.' },
            { type: 'werkwoorden',  desc: 'Conjugar verbos cotidianos: go, come, eat, drink.' },
          ],
          goals: [
            'Hacer preguntas con do/does y palabras interrogativas',
            'Formar negaciones con don\'t y doesn\'t',
            'Usar what, where, when, why, who, how correctamente',
            'Hablar sobre gustos y actividades de tiempo libre',
          ],
        },

        {
          unit: 4,
          title: 'Casa y ciudad',
          titleEn: 'Home and the city',
          weeks: 'Semana 7–8',
          grammarTopics: ['there-is-are'],
          verbFocus: ['be', 'have', 'need', 'want', 'get'],
          vocabTopics: [
            { level: 'A1', topic: 'home' },
            { level: 'A1', topic: 'transport' },
          ],
          sentenceFilter: 'Statement',
          activities: [
            { type: 'woordenschat', desc: 'Aprender vocabulario de casa y transporte.' },
            { type: 'grammatica',   desc: 'Estudiar there is / there are y sus formas.' },
            { type: 'zinnen',       desc: 'Practicar frases sobre la casa y la ciudad.' },
            { type: 'werkwoorden',  desc: 'Conjugar verbos: need, want, get.' },
            { type: 'dehet',        desc: 'Practicar a / an con palabras del nivel A1.' },
          ],
          goals: [
            'Describir tu casa y tu ciudad usando there is/are',
            'Usar a/an correctamente según el sonido inicial',
            'Hablar sobre el transporte y los desplazamientos',
            'Hacer preguntas sobre la existencia de lugares y cosas',
          ],
        },
      ],
    },

    {
      level: 'A2',
      title: 'Elemental',
      duration: '4 semanas',
      durationEn: '4 weeks',
      color: '#1B3D7A',
      units: [
        {
          unit: 5,
          title: 'Acciones en progreso',
          titleEn: 'Actions in progress',
          weeks: 'Semana 9–10',
          grammarTopics: ['present-continuous'],
          verbFocus: ['work', 'study', 'read', 'write', 'listen', 'watch', 'cook'],
          vocabTopics: [
            { level: 'A1', topic: 'body' },
            { level: 'A1', topic: 'adjective' },
          ],
          sentenceFilter: 'Statement',
          activities: [
            { type: 'woordenschat', desc: 'Aprender vocabulario de cuerpo y adjetivos.' },
            { type: 'grammatica',   desc: 'Estudiar el presente continuo: be + verb-ing.' },
            { type: 'zinnen',       desc: 'Practicar frases en presente continuo.' },
            { type: 'werkwoorden',  desc: 'Practicar verbos con -ing: reglas de ortografía.' },
          ],
          goals: [
            'Describir acciones que ocurren en este momento',
            'Formar el presente continuo correctamente',
            'Aplicar las reglas de ortografía del -ing',
            'Distinguir entre presente simple y presente continuo',
          ],
        },

        {
          unit: 6,
          title: 'Hablar del pasado',
          titleEn: 'Talking about the past',
          weeks: 'Semana 11–12',
          grammarTopics: ['simple-past'],
          verbFocus: ['go', 'see', 'eat', 'buy', 'take', 'come', 'make', 'give'],
          vocabTopics: [
            { level: 'A1', topic: 'time' },
            { level: 'A1', topic: 'food' },
            { level: 'A1', topic: 'transport' },
          ],
          sentenceFilter: 'Statement',
          activities: [
            { type: 'woordenschat', desc: 'Repasar vocabulario de tiempo, comida y transporte.' },
            { type: 'grammatica',   desc: 'Estudiar el pasado simple: verbos regulares e irregulares.' },
            { type: 'zinnen',       desc: 'Practicar frases en pasado simple.' },
            { type: 'werkwoorden',  desc: 'Conjugar verbos irregulares en pasado: went, saw, ate...' },
          ],
          goals: [
            'Hablar sobre eventos pasados usando el pasado simple',
            'Conjugar verbos regulares en pasado (-ed)',
            'Recordar los verbos irregulares más frecuentes',
            'Hacer preguntas y negaciones en pasado con "did"',
          ],
        },
      ],
    },

  ],
};

// ── expose ───────────────────────────────────────────────────
if (typeof module !== 'undefined') {
  module.exports = { grammarTopicsData, lessonPlanData };
}
