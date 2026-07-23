"""
HTML and CSS template for candidate interview report PDF.
Placeholders are surrounded by double curly braces e.g., {{USERNAME}}.
"""

REPORT_HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 16mm;
    margin-bottom: 24mm;
    @frame footer {
      -pdf-frame-content: footerFirst;
      bottom: 8mm;
      left: 16mm;
      right: 16mm;
      height: 14mm;
    }
  }
  @page inner_pages {
    size: A4 portrait;
    margin: 8mm 16mm;
    margin-bottom: 24mm;
    @frame footer {
      -pdf-frame-content: footerOther;
      bottom: 8mm;
      left: 16mm;
      right: 16mm;
      height: 14mm;
    }
  }
  body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 7.7pt;
    line-height: 1.11;
    color: #000;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 3.5pt;
    font-size: 7.7pt;
  }
  td, th {
    border: 0.5px solid #000;
    padding: 1.6px 2.6px;
    vertical-align: middle;
    line-height: 1.08;
  }
  .footer-table, .footer-table td {
    border: none !important;
    padding: 0 !important;
  }
  .section-title {
    font-size: 7.8pt;
    font-weight: bold;
    margin: 4.5pt 0 1.8pt 0;
  }
  .bold { font-weight: bold; }
</style>
</head>
<body>
<pdf:nexttemplate name="inner_pages" />

<div id="footerFirst" style="font-size: 7.7pt; font-family: Helvetica, Arial, sans-serif; color: #333;">
  <div style="border-top: 0.5px solid #bbb; padding-top: 5px; margin-bottom: 2px;"></div>
  <table class="footer-table" style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 0;">
    <tr>
      <td style="border: none; text-align: left; width: 50%; padding: 0; line-height: 1.3; font-weight: bold; color: #111;">
        {{USERNAME}}
      </td>
      <td style="border: none; text-align: right; width: 50%; padding: 0; line-height: 1.3; font-weight: bold; color: #111;">
        Signature: ______________________
      </td>
    </tr>
    <tr>
      <td style="border: none; text-align: left; width: 50%; padding: 0; line-height: 1.3; color: #555;">
        {{MOBILE}}
      </td>
      <td style="border: none; text-align: right; width: 50%; padding: 0; line-height: 1.3; font-weight: normal; color: #777;">
        page <pdf:pagenumber> of <pdf:pagecount>
      </td>
    </tr>
  </table>
</div>

<div id="footerOther" style="font-size: 7.7pt; font-family: Helvetica, Arial, sans-serif; color: #333;">
  <div style="border-top: 0.5px solid #bbb; padding-top: 5px; margin-bottom: 2px;"></div>
  <table class="footer-table" style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 0;">
    <tr>
      <td style="border: none; text-align: left; width: 50%; padding: 0; line-height: 1.3; font-weight: bold; color: #111;">
        {{USERNAME}}
      </td>
      <td style="border: none; text-align: right; width: 50%; padding: 0; line-height: 1.3;">
        &nbsp;
      </td>
    </tr>
    <tr>
      <td style="border: none; text-align: left; width: 50%; padding: 0; line-height: 1.3; color: #555;">
        {{MOBILE}}
      </td>
      <td style="border: none; text-align: right; width: 50%; padding: 0; line-height: 1.3; font-weight: normal; color: #777;">
        page <pdf:pagenumber> of <pdf:pagecount>
      </td>
    </tr>
  </table>
</div>

<!-- HEADER -->
<table style="border:none; margin-bottom:4pt; width: 100%;">
  <tr>
    <td style="border:none; font-size:15pt; font-weight:bold; width: 70%; vertical-align: bottom; padding: 0 0 2px 0;">{{USERNAME}}</td>
    <td style="border:none; text-align:right; width: 30%; vertical-align: bottom; padding: 0;">
      <div style="display: inline-block; text-align: right;">
        {{LOGO_HTML}}<br/>
        <span style="font-size:7.6pt; font-weight:bold; line-height: 1; margin-top: 10px;">Date: {{TODAY}}</span>
      </div>
    </td>
  </tr>
</table>

<!-- 1. PERSONAL DETAILS -->
<p class="section-title">1. Personal Details</p>
<table style="border:none; border-collapse:collapse; margin-bottom:2pt; width: 100%;">
  <tbody>
    <tr>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Gender:</span> {{GENDER}}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Date of Birth:</span> {{DOB}}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Mobile:</span> {{MOBILE}}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Email:</span> {{EMAIL}}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none; padding:1px 0;"><span class="bold">Present Address:</span> {{ADDRESS}}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none; padding:1px 0;"><span class="bold">Permanent Address:</span> {{ADDRESS}}</td>
    </tr>
    <tr>
      <td colspan="2" style="border:none; width:50%; padding:1px 0;"><span class="bold">Have you Applied Arcgate before?:</span> No</td>
      <td colspan="2" style="border:none; width:50%; padding:1px 0;"><span class="bold">Have you Worked in Arcgate before?:</span> {{ARCGATE}}</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
  <tbody>
    <tr>
      <td class="bold" style="width: 40%;">How did you hear about Arcgate?:</td>
      <td style="width: 60%;">{{HOW_DID_YOU_HEAR}}</td>
    </tr>
  </tbody>
</table>

<!-- 2. EDUCATIONAL QUALIFICATION -->
<p class="section-title">2. Educational Qualification</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 13%; text-align: center;">Education</th>
      <th style="width: 15%; text-align: center;">Education Details</th>
      <th style="width: 18%; text-align: center;">School/College</th>
      <th style="width: 15%; text-align: center;">Board/University</th>
      <th style="width: 10%; text-align: center;">Medium</th>
      <th style="width: 15%; text-align: center;">Passing Year</th>
      <th style="width: 8%; text-align: center;">Division</th>
      <th style="width: 6%; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    {{EDU_ROWS}}
  </tbody>
</table>

<!-- 3. FAMILY DETAILS -->
<p class="section-title">3. Family Details</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 20%; text-align:left;">Relation</th>
      <th style="width: 35%; text-align:left;">Name</th>
      <th style="width: 30%; text-align:left;">Occupation</th>
      <th style="width: 15%; text-align:left;">Dependent Y/N</th>
    </tr>
  </thead>
  <tbody>
    {{FAM_ROWS}}
  </tbody>
</table>

<!-- 4. WORK EXPERIENCE -->
<p class="section-title">4. Work Experience</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 25%; text-align:left;">Name of Company</th>
      <th style="width: 20%; text-align:left;">Designation</th>
      <th style="width: 15%; text-align: center;">Joining Date</th>
      <th style="width: 15%; text-align: center;">Date of Leaving</th>
      <th style="width: 15%; text-align:left;">Reason for Leaving</th>
      <th style="width: 10%; text-align: center;">Last Salary Drawn</th>
    </tr>
  </thead>
  <tbody>
    {{WORK_ROWS}}
  </tbody>
</table>

<!-- Q5–Q9 -->
<p style="margin:0.8pt 0;" class="bold">5. Are you willing for 1 Year Service Commitment?
  <span style="font-weight:normal;">&nbsp;{{COMMITMENT}}</span></p>
<p style="margin:0.8pt 0;" class="bold">6. What is your preferred shift time for work at Arcgate?
  <span style="font-weight:normal;">&nbsp;{{SHIFT_TIME}}</span></p>
<p style="margin:0.8pt 0;" class="bold">7. Joining date if selected:
  <span style="font-weight:normal;">&nbsp;{{JOINING}}</span></p>
<p style="margin:0.8pt 0;" class="bold">8. Salary Expected:
  <span style="font-weight:normal;">&nbsp;{{SALARY}}</span></p>
<p style="margin:0.8pt 0; margin-bottom:1.5pt;" class="bold">9. Do you agree for 1 month salary as security deposit?
  <span style="font-weight:normal;">&nbsp;{{DEPOSIT}}</span></p>

<!-- ROUND ONE OF SELECTION PROCESS -->
<p class="section-title">10. Round One of Selection Process</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width:30%; text-align:left;">Sub Sections</th>
      <th style="width:20%; text-align:left;">Grade/Score</th>
      <th style="width:35%; text-align:left;">Sub Sections</th>
      <th style="width:15%; text-align:left;">Grade/Score</th>
    </tr>
  </thead>
  <tbody>
    {{COL_ROWS}}
  </tbody>
</table>

<!-- 11. ROUND TWO / INTERVIEW EVALUATION -->
<p class="section-title">11. Round Two of Selection Process (Interview Evaluation)</p>
<table style="border:none; border-collapse:collapse; margin-bottom:2pt; width: 100%;">
  <tbody>
    <tr>
      <td style="border:none; width:50%; padding:1px 0;"><span class="bold">Project Lead / Evaluator:</span> {{LEAD_NAME}}</td>
      <td style="border:none; width:50%; padding:1px 0;"><span class="bold">Evaluation Date:</span> {{CREATED_AT}}</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; margin-top: 2pt;">
  <thead>
    <tr>
      <th style="width:30%; text-align:left;">Metric Name</th>
      <th style="width:20%; text-align:left;">Rating</th>
      <th style="width:35%; text-align:left;">Metric Name</th>
      <th style="width:15%; text-align:left;">Rating</th>
    </tr>
  </thead>
  <tbody>
    {{EVAL_METRICS_ROWS}}
  </tbody>
</table>

<table style="width: 100%; margin-top: 2pt;">
  <tbody>
    <tr>
      <td class="bold" style="width:25%">Overall Grade</td>
      <td style="width:25%; font-weight:bold;">{{OVERALL_GRADE}}</td>
      <td class="bold" style="width:25%">Final Result / Status</td>
      <td style="width:25%; font-weight:bold;">{{RESULT_NAME}}</td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Comments &amp; Feedback</td>
      <td colspan="3" style="width:75%;">{{COMMENTS}}</td>
    </tr>
  </tbody>
</table>

<!-- RESULT OF ROUND ONE -->
<p class="section-title">12. Result of Round One Selection Process of Interview</p>
<table style="width: 100%;">
  <tbody>
    <tr>
      <td class="bold" style="width:25%">Selected</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Selection Status</td>
      <td style="width:25%; font-weight:bold;"></td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Joining Date</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Project Assigned</td>
      <td style="width:25%;"></td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Salary Offered</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Candidates Signature<br/>(Agreed &amp; Accepted)</td>
      <td style="width:25%;"></td>
    </tr>
  </tbody>
</table>

</body>
</html>
"""
