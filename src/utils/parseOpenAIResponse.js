function parseOpenAIResponse(content) {
    console.log('Parsing content:', content); // Log the raw content
    const sections = content.split('\n\n').reduce((acc, section) => {
      const [title, ...lines] = section.split('\n');
      acc[title.trim()] = lines.join('\n');
      return acc;
    }, {});

    console.log('Parsed sections:', sections);
    
    const resumeKeywords = sections['Resume Keywords:']?.split('\n- ').filter(Boolean);
    const jobDescriptionKeywords = sections['Job Description Keywords:']?.split('\n- ').filter(Boolean);
    const missingKeywords = sections['Missing Keywords:']?.split('\n- ').filter(Boolean);
    const assessment = sections['Assessment:'];
    const employabilityScore = sections['Employability Score:']?.match(/\d+/)[0];
    const bestPossibleJob = sections['Best Possible Job:'];
  
    const atsScore = resumeKeywords && jobDescriptionKeywords
      ? (resumeKeywords.length / jobDescriptionKeywords.length) * 100
      : 0;
  
    return {
      resumeKeywords,
      jobDescriptionKeywords,
      missingKeywords,
      assessment,
      employabilityScore,
      bestPossibleJob,
      atsScore
    };
  }