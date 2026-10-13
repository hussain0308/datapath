/* Datapath | interview hub and mock-test screens */
(function () {
  "use strict";
  const DP = window.Datapath;
  const { $, esc, fmt, shuffle } = DP.utils;
  const QUESTIONS = DP.interviewBank.all();
  const AREAS = ['Excel', 'SQL', 'Python', 'Power BI', 'Data Analysis', 'Statistics', 'Projects & Resume', 'HR'];
  const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
  const COUNT_CHOICES = [5, 10, 15];
  let hubArea = AREAS[0];
  let mock = null;

  const areaOptions = selected => ['All'].concat(AREAS).map(area =>
    '<option value="' + esc(area) + '"' + (selected === area ? ' selected' : '') + '>' + esc(area) + '</option>').join('');
  const filtered = (area, difficulty, kind) => QUESTIONS.filter(q =>
    (area === 'All' || q.area === area) &&
    (difficulty === 'all' || q.difficulty === difficulty) &&
    (kind === 'all' || q.kind === kind));
  const kindLabel = kind => kind === 'mcq' ? 'Multiple choice' : kind === 'scenario' ? 'Scenario' : 'Interview question';
  const difficultyLabel = value => value.charAt(0).toUpperCase() + value.slice(1);

  function renderHub(){
    const questions = QUESTIONS.filter(q => q.area === hubArea);
    const counts = {
      interview: questions.filter(q => q.kind === 'interview').length,
      scenario: questions.filter(q => q.kind === 'scenario').length,
      mcq: questions.filter(q => q.kind === 'mcq').length
    };
    let     html = '<header class="interview-heading"><h1>Interview preparation</h1>' +
      '<a class="btn" href="#/mock">Start a mock test</a></header>' +
      '<div class="interview-browser"><nav class="interview-sidebar" aria-label="Interview topics">';
    AREAS.forEach(area => {
      const count = QUESTIONS.filter(q => q.area === area && q.kind === 'interview').length;
      html += '<button class="interview-area-link' + (area === hubArea ? ' active' : '') + '" type="button" data-interview-area="' + esc(area) + '"' +
        (area === hubArea ? ' aria-current="page"' : '') + '><span>' + esc(area) + '</span><small>' + count + '</small></button>';
    });
    html += '</nav><section class="interview-question-panel" aria-labelledby="interviewAreaTitle"><header class="interview-panel-heading"><div><h2 id="interviewAreaTitle">' + esc(hubArea) + '</h2>' +
      '<p class="interview-area-count">' + counts.interview + ' interview questions · ' + counts.scenario + ' scenarios · ' + counts.mcq + ' multiple-choice questions</p></div>' +
      '<p class="muted">Open a question to see a sample answer and guidance.</p></header><div class="interview-question-list">';
    questions.forEach(q => {
      html += '<details class="interview-question"><summary><span class="interview-tags"><i class="kind-' + esc(q.kind) + '">' + esc(kindLabel(q.kind)) + '</i><i>' + esc(difficultyLabel(q.difficulty)) + '</i></span>' + fmt(q.question) + '</summary>' +
        '<div class="interview-answer">' +
        (q.kind === 'mcq'
          ? '<b>Correct answer: ' + fmt(q.options[q.answerIndex]) + '</b><p>' + fmt(q.answer) + '</p>'
          : '<b>Sample answer</b><p>' + fmt(q.answer) + '</p><b>How to present it</b><p>' + fmt(q.guidance) + '</p>') +
        (q.framework ? '<b>A clear way to organize it</b><p>' + fmt(q.framework) + '</p>' : '') + '</div></details>';
    });
    html += '<p class="interview-note">Numbers in hypothetical scenarios are illustrative. Project examples use resume facts with personal identifiers removed. Adapt them to your own verified experience; never claim results, skills or responsibilities you cannot support.</p>' +
      '<details class="interview-example-toggle"><summary>View a sample interview dialogue</summary><section class="interview-example"><div class="interview-example-head"><div><p class="interview-eyebrow">EXAMPLE INTERVIEW</p><h2>Explaining a project from a resume</h2></div><span>Personal details omitted</span></div>' +
      '<div class="interview-turn"><b>Interviewer</b><p>Tell me about an analytics project you worked on.</p></div>' +
      '<div class="interview-turn candidate"><b>Candidate</b><p>One project I built was a Google Play Store analytics dashboard. I wrote 14 MySQL queries to study app performance, installs, pricing and category trends, and prepared the dataset with Pandas before building the Power BI report. It had at least four KPI cards and at least six visualizations covering category performance, the free-versus-paid split, content ratings and month- and year-wise trends. I also compared free and paid apps across two pricing tiers and looked at update patterns. The dashboard made those patterns easier to explore, but I did not measure a change in downloads or revenue, so I would not claim that as a business result.</p></div>' +
      '<div class="interview-turn"><b>Interviewer</b><p>How did you make sure the analysis was reliable?</p></div>' +
      '<div class="interview-turn candidate"><b>Candidate</b><p>For a separate sales analysis, I worked with 1,000+ rows, checked the data types and validated the rows before analyzing revenue trends, top products and customer segments. I created at least four visualizations to explain the findings. I would keep the two projects separate and show the cleaning steps and checks for whichever project we are discussing.</p></div>' +
      '<p class="interview-example-note">The project details and figures here are based on resume experience, with identifying information left out. Use only claims and figures that match your own work, and be ready to explain how you produced them.</p></section></details></div></section></div>';
    $('view').innerHTML = html;
    document.title = 'Interview preparation | Datapath';
  }

  function mockForm(){
    const form = $('mockSetup');
    const area = form.elements.area.value;
    const difficulty = form.elements.difficulty.value;
    const kind = form.elements.kind.value;
    const available = filtered(area, difficulty, kind).length;
    const counts = COUNT_CHOICES.filter(n => n <= available);
    const count = counts.includes(Number(form.elements.count.value)) ? Number(form.elements.count.value) : counts[0];
    form.elements.count.innerHTML = counts.length
      ? counts.map(n => '<option value="' + n + '"' + (count === n ? ' selected' : '') + '>' + n + ' questions</option>').join('')
      : '<option value="">At least 5 matching questions required</option>';
    $('mockAvailable').textContent = available >= 5
      ? available + ' matching questions available.'
      : available
        ? 'Only ' + available + ' questions match. Broaden the filters; a mock test needs at least 5.'
        : 'No questions match this combination. Choose other filters.';
    $('mockStart').disabled = !counts.length;
  }

  function renderMockSetup(){
    mock = null;
    $('view').innerHTML = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/interview">Interview preparation</a> / Mock test</nav>' +
      '<h1>Set up a mock test</h1><p class="lede">Choose a topic and question style. You can move between questions, revise your responses and review the answer guidance before finishing.</p>' +
      '<form class="mock-setup" id="mockSetup"><label>Skill area<select name="area">' + areaOptions('All') + '</select></label>' +
      '<label>Difficulty<select name="difficulty"><option value="all">All levels</option>' + DIFFICULTIES.map(d => '<option value="' + d + '">' + esc(difficultyLabel(d)) + '</option>').join('') + '</select></label>' +
      '<label>Question type<select name="kind"><option value="all">All types</option><option value="interview">Interview questions</option><option value="scenario">Scenarios</option><option value="mcq">Multiple choice</option></select></label>' +
      '<label>Test length<select name="count"></select></label><p id="mockAvailable" class="mock-available" aria-live="polite"></p>' +
      '<button class="btn" id="mockStart" type="submit">Start mock test</button></form>' +
      '<p class="interview-note">Multiple-choice questions are scored automatically. Written interview and scenario answers are self-rated against the displayed guidance; this is practice feedback, not an objective interview score.</p>';
    document.title = 'Set up a mock test | Datapath';
    mockForm();
  }

  function beginMock(area, difficulty, kind, count){
    const questions = shuffle(filtered(area, difficulty, kind)).slice(0, count);
    if (!questions.length) return;
    mock = { questions, answers: questions.map(() => ({ text:'', choice:null, revealed:false, rating:null })), current:0 };
    drawMock();
  }

  function drawMock(){
    if (!mock) return;
    const { questions, answers, current } = mock;
    const q = questions[current], state = answers[current];
    const done = answers.filter((a,i) => questions[i].kind === 'mcq' ? a.choice !== null : !!a.rating).length;
    const answeredText = q.kind === 'mcq' ? (state.choice !== null ? 'Answer selected' : 'Not answered') : (state.text.trim() ? 'Response entered' : 'Not answered');
    let prompt = '';
    if (q.kind === 'mcq') {
      prompt = '<div class="mock-options">' + q.options.map((option,i) => {
        let cls = state.choice === i ? ' selected' : '';
        if (state.revealed && i === q.answerIndex) cls = ' correct';
        else if (state.revealed && state.choice === i) cls = ' incorrect';
        return '<button type="button" class="mock-option' + cls + '" data-action="choose" data-index="' + i + '"' + (state.revealed ? ' disabled' : '') + '><span class="mock-option-letter">' + String.fromCharCode(65+i) + '</span>' + fmt(option) + '</button>';
      }).join('') + '</div>';
      if (state.revealed) prompt += '<div class="mock-feedback ' + (state.choice === q.answerIndex ? 'good' : 'bad') + '"><b>' + (state.choice === q.answerIndex ? 'Correct.' : 'Review this one.') + '</b> ' + fmt(q.answer) + '</div>';
      if (state.revealed) prompt += '<button class="btn ghost mock-reveal" type="button" data-action="changeChoice">Change answer</button>';
    } else {
      prompt = '<label class="mock-response-label" for="mockResponse">Your response</label><textarea id="mockResponse" rows="6" placeholder="Write or outline your answer here. You can return and edit it before finishing.">' + esc(state.text) + '</textarea>';
      prompt += state.revealed ? '<div class="mock-guidance"><b>Sample answer</b><p>' + fmt(q.answer) + '</p><b>How to present it</b><p>' + fmt(q.guidance) + '</p>' + (q.framework ? '<b>A clear way to organize it</b><p>' + fmt(q.framework) + '</p>' : '') +
        '<div class="mock-self-rate"><span>How well did your answer cover the important points?</span><button class="btn ghost' + (state.rating === 'ready' ? ' selected' : '') + '" type="button" data-action="rate" data-rating="ready">I covered them</button><button class="btn ghost' + (state.rating === 'review' ? ' selected' : '') + '" type="button" data-action="rate" data-rating="review">I need to review</button></div></div>' :
        '<button class="btn ghost mock-reveal" type="button" data-action="reveal">Show answer guidance</button>';
    }
    $('view').innerHTML = '<div class="mock-top"><a class="back-link" href="#/interview">&larr; Interview preparation</a><span class="mock-count">Question ' + (current+1) + ' of ' + questions.length + '</span></div>' +
      '<div class="mock-progress" role="progressbar" aria-label="Questions completed" aria-valuemin="0" aria-valuemax="' + questions.length + '" aria-valuenow="' + done + '"><i style="width:' + Math.round(done/questions.length*100) + '%"></i></div>' +
      '<div class="mock-card"><div class="interview-tags"><i class="kind-' + esc(q.kind) + '">' + esc(kindLabel(q.kind)) + '</i><i>' + esc(q.area) + '</i><i>' + esc(difficultyLabel(q.difficulty)) + '</i></div>' +
      '<h1>' + fmt(q.question) + '</h1><p class="mock-answer-status" aria-live="polite">' + answeredText + '</p>' + prompt +
      '<div class="mock-navigation"><button class="btn ghost" type="button" data-action="previous"' + (current === 0 ? ' disabled' : '') + '>Previous</button>' +
      '<div class="mock-step-buttons" aria-label="Go to question">' + questions.map((item,i) => '<button type="button" class="mock-step' + (i === current ? ' current' : '') + (answers[i].choice !== null || answers[i].rating ? ' completed' : '') + '" data-action="goto" data-index="' + i + '" aria-label="Question ' + (i+1) + (answers[i].choice !== null || answers[i].rating ? ', response recorded' : ', not completed') + '" aria-current="' + (i === current ? 'step' : 'false') + '">' + (i+1) + '</button>').join('') + '</div>' +
      '<button class="btn" type="button" data-action="next"' + (current === questions.length - 1 ? ' disabled' : '') + '>Next</button></div>' +
      '<div class="mock-finish-row"><span>' + done + ' of ' + questions.length + ' questions completed</span><button class="btn ghost" type="button" data-action="finish">Finish and review results</button></div></div>';
    document.title = 'Mock test: question ' + (current+1) + ' | Datapath';
  }

  function renderResults(){
    const { questions, answers } = mock;
    const objective = questions.map((q,i) => ({q,a:answers[i]})).filter(item => item.q.kind === 'mcq');
    const correct = objective.filter(item => item.a.choice === item.q.answerIndex).length;
    const subjective = questions.map((q,i) => ({q,a:answers[i]})).filter(item => item.q.kind !== 'mcq');
    const ready = subjective.filter(item => item.a.rating === 'ready').length;
    const reviewed = subjective.filter(item => item.a.rating === 'review').length;
    const unfinished = questions.length - objective.filter(item => item.a.choice !== null).length - subjective.filter(item => item.a.rating !== null).length;
    let html = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/interview">Interview preparation</a> / Mock test results</nav><h1>Mock test results</h1>' +
      '<p class="lede">Use this review to choose what to practise next. Written answers are self-rated; they are not marked by the site.</p><div class="mock-result-grid">' +
      (objective.length ? '<div><b>' + correct + ' / ' + objective.length + '</b><span>multiple-choice answers correct</span></div>' : '') +
      (subjective.length ? '<div><b>' + ready + ' / ' + subjective.length + '</b><span>written answers you rated ready</span></div><div><b>' + reviewed + '</b><span>written answers marked for review</span></div>' : '') +
      '<div><b>' + unfinished + '</b><span>questions left incomplete</span></div></div>';
    if (objective.length) {
      const scorePct = Math.round(correct/objective.length*100);
      html += '<p class="mock-score-note">' + scorePct + '% correct on multiple-choice questions. This score covers only the objective questions in this test.</p>';
    }
    html += '<div class="mock-results-list">';
    questions.forEach((q,i) => {
      const a = answers[i];
      const result = q.kind === 'mcq' ? (a.choice === q.answerIndex ? 'Correct' : a.choice === null ? 'Not answered' : 'Incorrect') :
        (a.rating === 'ready' ? 'Self-rated: covered key points' : a.rating === 'review' ? 'Self-rated: review needed' : 'Not self-rated');
      html += '<details class="mock-result-item"><summary><span>Question ' + (i+1) + ' · ' + esc(result) + '</span>' + fmt(q.question) + '</summary><div class="interview-answer">';
      if (q.kind === 'mcq') html += '<p><b>Your answer:</b> ' + (a.choice === null ? 'Not answered' : fmt(q.options[a.choice])) + '</p><p><b>Correct answer:</b> ' + fmt(q.options[q.answerIndex]) + '</p>';
      else html += '<p><b>Your response:</b> ' + (a.text.trim() ? fmt(a.text) : 'No response entered.') + '</p>';
      html += q.kind === 'mcq'
        ? '<p><b>Explanation:</b> ' + fmt(q.answer) + '</p>'
        : '<p><b>Sample answer:</b> ' + fmt(q.answer) + '</p><p><b>How to present it:</b> ' + fmt(q.guidance) + '</p>';
      html += '</div></details>';
    });
    html += '</div><div class="interview-actions"><button class="btn" type="button" data-action="restart">Start another test</button><a class="btn ghost" href="#/interview">Browse practice questions</a></div>';
    $('view').innerHTML = html;
    document.title = 'Mock test results | Datapath';
  }

  function handleClick(event){
    const button = event.target.closest('[data-action]');
    if (!button || !mock) return;
    const action = button.dataset.action, state = mock.answers[mock.current];
    if (action === 'restart'){ renderMockSetup(); }
    else if (action === 'choose' && !state.revealed){ state.choice = Number(button.dataset.index); state.revealed = true; drawMock(); }
    else if (action === 'reveal'){ state.revealed = true; drawMock(); }
    else if (action === 'rate'){
      if (!state.text.trim()){
        const status = $('view').querySelector('.mock-answer-status');
        if (status) status.textContent = 'Write a response before rating it.';
        return;
      }
      state.rating = button.dataset.rating;
      drawMock();
    }
    else if (action === 'changeChoice'){ state.revealed = false; drawMock(); }
    else if (action === 'previous' && mock.current > 0){ mock.current--; drawMock(); }
    else if (action === 'next' && mock.current < mock.questions.length - 1){ mock.current++; drawMock(); }
    else if (action === 'goto'){ mock.current = Number(button.dataset.index); drawMock(); }
    else if (action === 'finish'){ renderResults(); }
  }

  $('view').addEventListener('change', event => {
    if (event.target.closest('#mockSetup') && event.target.name !== 'count') mockForm();
  });
  $('view').addEventListener('submit', event => {
    if (event.target.id !== 'mockSetup') return;
    event.preventDefault();
    const form = event.target;
    beginMock(form.elements.area.value, form.elements.difficulty.value, form.elements.kind.value, Number(form.elements.count.value));
  });
  $('view').addEventListener('input', event => {
    if (event.target.id === 'mockResponse' && mock) {
      mock.answers[mock.current].text = event.target.value;
      mock.answers[mock.current].rating = null;
      const status = $('view').querySelector('.mock-answer-status');
      if (status) status.textContent = event.target.value.trim() ? 'Response entered' : 'Not answered';
    }
  });
  $('view').addEventListener('click', handleClick);
  $('view').addEventListener('click', event => {
    const areaButton = event.target.closest('[data-interview-area]');
    if (!areaButton) return;
    hubArea = areaButton.dataset.interviewArea;
    renderHub();
    const selectedButton = $('view').querySelector('.interview-area-link[aria-current="page"]');
    if (selectedButton) selectedButton.focus();
  });

  DP.pages = DP.pages || {};
  DP.pages.interview = renderHub;
  DP.pages.mock = renderMockSetup;
})();
