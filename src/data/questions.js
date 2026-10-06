// 이 파일은 브라우저에서 바로 열 수 있도록 .js로 저장하지만, '=' 뒤의 { } 안은 JSON 형식이다.
// 문제를 추가할 때는 JSON 문법(큰따옴표, 쉼표)을 지켜서 수정한다. 형식은 README.md 참고.
window.TM_DATA = window.TM_DATA || {};
window.TM_DATA.questions = {
  "schema_version": 1,
  "passages": [
    {
      "passage_id": "d1-p6-psg1",
      "day": 1,
      "part": 6,
      "type": "single",
      "documents": [
        {
          "title": "",
          "html": "<p class=\"meta\"><b>To:</b> All Staff<br><b>From:</b> Facilities Department<br><b>Subject:</b> Office Relocation</p>\n<p>Dear colleagues,</p>\n<p>As you know, our office will be moving to Riverside Tower next month. The move is scheduled to take place over the weekend of May 18 so that normal business operations will not be <span class=\"blank\">(1)</span>.</p>\n<p>Please pack your personal belongings in the boxes <span class=\"blank\">(2)</span> by the facilities team. Each box should be clearly labeled with your name and department. <span class=\"blank\">(3)</span> Staff members who need additional supplies should contact Mr. Ortega at extension 214.</p>\n<p>We appreciate your cooperation and look forward to <span class=\"blank\">(4)</span> you in our new workspace.</p>"
        }
      ]
    },
    {
      "passage_id": "d2-p6-psg1",
      "day": 2,
      "part": 6,
      "type": "single",
      "documents": [
        {
          "title": "",
          "html": "<p class=\"meta\"><b>Greenfield Public Library — Reading Room Reopening</b></p>\n<p>Greenfield Public Library is pleased to announce that its reading room will reopen on Monday, September 2, after three months of renovation. The project <span class=\"blank\">(1)</span> new seating, improved lighting, and additional power outlets for laptops.</p>\n<p><span class=\"blank\">(2)</span>, the library has extended its weekday hours until 9 P.M. to better serve students and working professionals.</p>\n<p>Visitors are encouraged to <span class=\"blank\">(3)</span> the new space during our open house on Saturday, September 7. <span class=\"blank\">(4)</span></p>"
        }
      ]
    },
    {
      "passage_id": "d1-p7-psg1",
      "day": 1,
      "part": 7,
      "type": "single",
      "documents": [
        {
          "title": "Advertisement",
          "html": "<p class=\"meta\"><b>Sunrise Fitness Center — Grand Opening Special!</b></p>\n<p>Join Sunrise Fitness Center before June 30 and receive 20% off your first year's membership. Our new facility at 45 Maple Avenue features state-of-the-art exercise equipment, an indoor swimming pool, and group classes ranging from yoga to kickboxing.</p>\n<p>Members also enjoy free parking and access to our nutrition counseling service. Personal training sessions are available for an additional fee.</p>\n<p>To sign up, visit our front desk or register online at www.sunrisefitness.com. Please bring a photo ID when you visit.</p>"
        }
      ]
    },
    {
      "passage_id": "d2-p7-psg1",
      "day": 2,
      "part": 7,
      "type": "single",
      "documents": [
        {
          "title": "E-mail",
          "html": "<p class=\"meta\"><b>From:</b> Daniel Reyes &lt;dreyes@harborlogistics.com&gt;<br><b>To:</b> Mina Choi &lt;mchoi@brightprint.com&gt;<br><b>Date:</b> March 3<br><b>Subject:</b> Order #4471</p>\n<p>Dear Ms. Choi,</p>\n<p>Thank you for your quick response to our request for 500 product catalogs. Unfortunately, after reviewing the proof you sent yesterday, we noticed that our company phone number on the back cover is incorrect. The correct number is 555-0182.</p>\n<p>Also, we would like to change the paper from standard to glossy, even if this increases the price. Please send us a revised quote along with an updated proof.</p>\n<p>Since we plan to distribute the catalogs at a trade fair on March 20, we would need to receive them no later than March 17. Please let me know if this schedule is possible.</p>\n<p>Best regards,<br>Daniel Reyes<br>Marketing Manager, Harbor Logistics</p>"
        }
      ]
    },
    {
      "passage_id": "d1-p7-psg2",
      "day": 1,
      "part": 7,
      "type": "single",
      "documents": [
        {
          "title": "Text-message chain",
          "html": "<p class=\"chat\"><b>Jenny Lee [9:12 A.M.]</b> Hi Tom, are you still at the client's office?</p>\n<p class=\"chat\"><b>Tom Baker [9:14 A.M.]</b> Yes, the meeting just ended. Why?</p>\n<p class=\"chat\"><b>Jenny Lee [9:15 A.M.]</b> The projector in Conference Room B isn't working, and I have a presentation at 10.</p>\n<p class=\"chat\"><b>Tom Baker [9:16 A.M.]</b> I have a portable one in my car.</p>\n<p class=\"chat\"><b>Jenny Lee [9:16 A.M.]</b> That would be great! When can you get back?</p>\n<p class=\"chat\"><b>Tom Baker [9:18 A.M.]</b> Traffic looks light. I should be there in 20 minutes.</p>\n<p class=\"chat\"><b>Jenny Lee [9:19 A.M.]</b> Perfect. I'll let the IT department know they don't need to send anyone.</p>"
        }
      ]
    }
  ],
  "questions": [
    {
      "question_id": "d1-p5-01",
      "day": 1,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "The marketing team will ------- the new product at next month's trade show.",
      "choices": [
        "introduce",
        "introduction",
        "introductory",
        "introduced"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "조동사 will 뒤에는 동사원형이 와야 합니다. 목적어 the new product를 취하는 동사 introduce가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "품사",
      "question_type": "품사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-02",
      "day": 1,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "Ms. Park has worked at the company ------- 2015.",
      "choices": [
        "for",
        "since",
        "during",
        "within"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "현재완료(has worked)와 함께 과거의 특정 시점(2015)을 나타낼 때는 since를 씁니다. for는 기간(for five years) 앞에 씁니다."
      },
      "vocabulary": [],
      "grammar_point": "전치사",
      "question_type": "전치사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-03",
      "day": 1,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "All employees must submit their expense reports ------- Friday.",
      "choices": [
        "by",
        "until",
        "on",
        "at"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "제출(submit)처럼 한 번에 끝나는 동작의 기한은 by(~까지)를 씁니다. until은 상태나 동작이 계속될 때(stay until Friday) 씁니다."
      },
      "vocabulary": [
        "submit"
      ],
      "grammar_point": "전치사",
      "question_type": "전치사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-04",
      "day": 1,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "------- the heavy rain, the outdoor concert was held as scheduled.",
      "choices": [
        "Although",
        "Despite",
        "Because",
        "Even"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "빈칸 뒤가 명사구(the heavy rain)이므로 전치사가 필요합니다. 의미상 '~에도 불구하고'인 Despite가 정답입니다. Although와 Because는 접속사라 절이 와야 합니다."
      },
      "vocabulary": [],
      "grammar_point": "전치사 vs 접속사",
      "question_type": "접속사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-05",
      "day": 1,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "The manager asked that every report ------- carefully before submission.",
      "choices": [
        "reviews",
        "is reviewed",
        "be reviewed",
        "reviewing"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "ask, request, require 같은 요구 동사 뒤 that절에서는 (should +) 동사원형을 씁니다. 보고서는 '검토되는' 대상이므로 수동형 be reviewed가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "가정법/당위",
      "question_type": "동사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-06",
      "day": 1,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Mr. Kim is the candidate ------- qualifications best match the job description.",
      "choices": [
        "who",
        "whom",
        "whose",
        "which"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "빈칸 뒤에 명사(qualifications)가 바로 오고, '그 후보자의 자격'이라는 소유 관계이므로 소유격 관계대명사 whose가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "관계사",
      "question_type": "관계사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-07",
      "day": 1,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "The new software is ------- easier to use than the previous version.",
      "choices": [
        "very",
        "much",
        "more",
        "most"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "비교급(easier)을 강조할 때는 much, even, far, still, a lot을 씁니다. very는 원급만 수식하고, easier는 이미 비교급이라 more를 붙일 수 없습니다."
      },
      "vocabulary": [],
      "grammar_point": "비교급",
      "question_type": "비교",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-08",
      "day": 1,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "Customers who wish to return an item should keep the receipt ------- proof of purchase.",
      "choices": [
        "as",
        "for",
        "like",
        "with"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "'~로서'라는 자격이나 역할을 나타낼 때는 as를 씁니다. keep A as B: A를 B로서 보관하다."
      },
      "vocabulary": [
        "proof"
      ],
      "grammar_point": "전치사",
      "question_type": "전치사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-09",
      "day": 1,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "The board members were ------- impressed by the quarterly results.",
      "choices": [
        "favor",
        "favorable",
        "favorably",
        "favorability"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "과거분사 impressed를 수식하는 자리이므로 부사 favorably가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "품사",
      "question_type": "품사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p5-10",
      "day": 1,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Neither the director ------- her assistant was available for comment.",
      "choices": [
        "or",
        "and",
        "nor",
        "but"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "상관접속사 neither A nor B(A도 B도 아닌) 구문입니다. either A or B, both A and B, not only A but (also) B도 함께 외워 두세요."
      },
      "vocabulary": [],
      "grammar_point": "상관접속사",
      "question_type": "접속사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-01",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Applications will not be accepted ------- the deadline has passed.",
      "choices": [
        "once",
        "during",
        "despite",
        "regarding"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "빈칸 뒤가 절(주어 + 동사)이므로 접속사가 필요합니다. once는 '일단 ~하면'이라는 뜻의 접속사입니다. during, despite, regarding은 전치사입니다."
      },
      "vocabulary": [
        "regarding"
      ],
      "grammar_point": "접속사",
      "question_type": "접속사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-02",
      "day": 2,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "Please ------- the attached document and return it by e-mail.",
      "choices": [
        "sign",
        "signature",
        "signing",
        "signed"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "Please로 시작하는 명령문이므로 동사원형이 와야 합니다. and 뒤의 return과도 병렬 구조를 이룹니다."
      },
      "vocabulary": [],
      "grammar_point": "품사",
      "question_type": "품사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-03",
      "day": 2,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "The training session was postponed because the instructor was ------- ill.",
      "choices": [
        "sudden",
        "suddenly",
        "suddenness",
        "more sudden"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "형용사 ill을 수식하는 자리이므로 부사 suddenly가 정답입니다."
      },
      "vocabulary": [
        "postpone"
      ],
      "grammar_point": "품사",
      "question_type": "품사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-04",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "By the time the shipment arrives, we ------- the warehouse renovation.",
      "choices": [
        "complete",
        "completed",
        "will have completed",
        "have completed"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "By the time + 현재시제(arrives)는 미래를 나타내고, 그 시점까지 완료될 일은 미래완료(will have p.p.)로 씁니다."
      },
      "vocabulary": [
        "renovation"
      ],
      "grammar_point": "시제",
      "question_type": "시제",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-05",
      "day": 2,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "Participants are asked to refrain ------- using their mobile phones during the presentation.",
      "choices": [
        "to",
        "from",
        "of",
        "with"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "refrain from -ing는 '~을 삼가다'라는 뜻의 관용 표현입니다. prevent/prohibit A from -ing와 함께 외워 두세요."
      },
      "vocabulary": [],
      "grammar_point": "전치사",
      "question_type": "어휘 collocation",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-06",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "The company plans to ------- its operations to Southeast Asia next year.",
      "choices": [
        "expand",
        "inform",
        "attend",
        "remain"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "expand A to B는 'A를 B로 확장하다'라는 뜻입니다. inform은 사람을 목적어로 취하고, attend는 '참석하다', remain은 자동사입니다."
      },
      "vocabulary": [],
      "grammar_point": "어휘",
      "question_type": "어휘",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-07",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Due to ------- demand, the limited edition sold out within hours.",
      "choices": [
        "overwhelm",
        "overwhelming",
        "overwhelmed",
        "overwhelms"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "명사 demand를 수식하는 형용사 자리입니다. 수요가 '압도적인'이라는 능동의 의미이므로 현재분사 overwhelming이 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "분사",
      "question_type": "동사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-08",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Each of the new interns ------- a mentor for the first three months.",
      "choices": [
        "assign",
        "are assigned",
        "is assigned",
        "assigning"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "Each of + 복수명사는 단수 취급하므로 is를 씁니다. 인턴은 멘토를 '배정받는' 쪽이므로 수동태 is assigned가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "수일치/태",
      "question_type": "수일치",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-09",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "The hotel offers complimentary breakfast to guests ------- stay for more than three nights.",
      "choices": [
        "who",
        "which",
        "what",
        "whose"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "선행사가 사람(guests)이고, 빈칸 뒤에 주어가 없이 동사(stay)가 바로 나오므로 주격 관계대명사 who가 정답입니다."
      },
      "vocabulary": [
        "complimentary"
      ],
      "grammar_point": "관계사",
      "question_type": "관계사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-10",
      "day": 2,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "Please contact our customer service department if you have ------- questions.",
      "choices": [
        "any",
        "much",
        "every",
        "another"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "복수 가산명사 questions 앞에 올 수 있고 if절에 잘 쓰이는 any가 정답입니다. much는 불가산명사, every와 another는 단수명사 앞에 씁니다."
      },
      "vocabulary": [],
      "grammar_point": "수량 표현",
      "question_type": "수량 표현",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-11",
      "day": 2,
      "part": 5,
      "difficulty": 1,
      "passage_id": null,
      "question": "The financial report must be reviewed ------- before it is released to shareholders.",
      "choices": [
        "thorough",
        "thoroughly",
        "thoroughness",
        "more thorough"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "수동태 동사 be reviewed를 수식하는 자리이므로 부사 thoroughly가 정답입니다."
      },
      "vocabulary": [],
      "grammar_point": "품사",
      "question_type": "품사",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p5-12",
      "day": 2,
      "part": 5,
      "difficulty": 2,
      "passage_id": null,
      "question": "Ms. Lopez was promoted to regional manager ------- her outstanding sales performance.",
      "choices": [
        "because",
        "due to",
        "although",
        "so that"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "빈칸 뒤가 명사구(her outstanding sales performance)이므로 전치사가 필요합니다. '~ 때문에'라는 뜻의 due to가 정답입니다. because는 접속사입니다."
      },
      "vocabulary": [],
      "grammar_point": "전치사 vs 접속사",
      "question_type": "접속사",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p6-01",
      "day": 1,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d1-p6-psg1",
      "question": "빈칸 (1)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "interrupt",
        "interrupted",
        "interrupting",
        "interruption"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "업무(operations)는 '방해받는' 대상이므로 will not be 뒤에 과거분사 interrupted를 써서 수동태를 만듭니다."
      },
      "vocabulary": [],
      "grammar_point": "태",
      "question_type": "문법",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p6-02",
      "day": 1,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d1-p6-psg1",
      "question": "빈칸 (2)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "provide",
        "providing",
        "provided",
        "provides"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "상자는 시설팀에 의해 '제공되는' 것이므로 과거분사 provided가 명사 boxes를 뒤에서 수식합니다. 뒤의 by the facilities team이 단서입니다."
      },
      "vocabulary": [],
      "grammar_point": "분사",
      "question_type": "문법",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p6-03",
      "day": 1,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d1-p6-psg1",
      "question": "빈칸 (3)에 들어갈 가장 알맞은 문장은?",
      "choices": [
        "Boxes and tape will be distributed on Wednesday, May 15.",
        "The new building has a large parking lot.",
        "The company was founded twenty years ago.",
        "Thank you for attending yesterday's meeting."
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "앞 문장은 짐 싸는 방법을, 뒤 문장은 '추가(additional) 물품'이 필요하면 연락하라는 내용입니다. 기본 포장 물품의 배포 일정을 알리는 (A)가 자연스럽게 이어집니다."
      },
      "vocabulary": [],
      "grammar_point": "문장 삽입",
      "question_type": "문장 삽입",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p6-04",
      "day": 1,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d1-p6-psg1",
      "question": "빈칸 (4)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "welcome",
        "welcoming",
        "welcomed",
        "welcomes"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "look forward to의 to는 전치사이므로 뒤에 동명사가 옵니다. look forward to -ing: ~하기를 고대하다."
      },
      "vocabulary": [],
      "grammar_point": "동명사",
      "question_type": "문법",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p6-01",
      "day": 2,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d2-p6-psg1",
      "question": "빈칸 (1)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "include",
        "included",
        "including",
        "to include"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "문장에 동사가 없으므로 본동사가 필요합니다. 공사는 이미 끝나고 재개관을 앞둔 상황이므로 과거시제 included가 정답입니다. 주어가 단수(The project)라 include는 수일치가 맞지 않습니다."
      },
      "vocabulary": [
        "renovation"
      ],
      "grammar_point": "시제",
      "question_type": "문법",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p6-02",
      "day": 2,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d2-p6-psg1",
      "question": "빈칸 (2)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "In addition",
        "However",
        "Otherwise",
        "Instead"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "앞 문단의 시설 개선에 이어 운영 시간 연장이라는 또 하나의 좋은 소식을 덧붙이므로 '게다가'라는 뜻의 In addition이 알맞습니다."
      },
      "vocabulary": [
        "renovation"
      ],
      "grammar_point": "접속부사",
      "question_type": "문맥",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p6-03",
      "day": 2,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d2-p6-psg1",
      "question": "빈칸 (3)에 들어갈 가장 알맞은 것은?",
      "choices": [
        "explore",
        "exploring",
        "explored",
        "exploration"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "be encouraged to + 동사원형(~하도록 권장되다) 구문입니다."
      },
      "vocabulary": [
        "renovation"
      ],
      "grammar_point": "to부정사",
      "question_type": "문법",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p6-04",
      "day": 2,
      "part": 6,
      "difficulty": 2,
      "passage_id": "d2-p6-psg1",
      "question": "빈칸 (4)에 들어갈 가장 알맞은 문장은?",
      "choices": [
        "Refreshments will be served, and staff will lead guided tours.",
        "The library was closed last year due to budget cuts.",
        "Overdue books must be returned immediately.",
        "The parking lot is currently being repaved."
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "바로 앞 문장이 오픈 하우스 행사를 안내하므로, 행사에서 제공될 다과와 가이드 투어를 소개하는 (A)가 자연스럽습니다."
      },
      "vocabulary": [
        "renovation",
        "budget"
      ],
      "grammar_point": "문장 삽입",
      "question_type": "문장 삽입",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-01",
      "day": 1,
      "part": 7,
      "difficulty": 1,
      "passage_id": "d1-p7-psg1",
      "question": "What is being advertised?",
      "choices": [
        "A new fitness facility",
        "A nutrition seminar",
        "A sports equipment store",
        "A swimming competition"
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "제목의 Grand Opening과 'Our new facility'에서 새로 문을 연 피트니스 센터 광고임을 알 수 있습니다."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "주제",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-02",
      "day": 1,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d1-p7-psg1",
      "question": "What is NOT included in the membership at no extra cost?",
      "choices": [
        "Free parking",
        "Group classes",
        "Personal training",
        "Nutrition counseling"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "'Personal training sessions are available for an additional fee.' 개인 트레이닝은 추가 요금이 듭니다. NOT 문제는 보기를 하나씩 지문과 대조해 지워 나가세요."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "NOT 문제",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-03",
      "day": 1,
      "part": 7,
      "difficulty": 1,
      "passage_id": "d1-p7-psg1",
      "question": "How can people receive a discount?",
      "choices": [
        "By bringing a friend",
        "By joining before the end of June",
        "By registering online only",
        "By paying in cash"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "'Join ... before June 30 and receive 20% off' — 6월 30일 전에 가입하면 할인을 받습니다. 지문의 June 30이 보기에서 the end of June으로 바뀌어(패러프레이징) 나왔습니다."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "세부 정보",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p7-01",
      "day": 2,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d2-p7-psg1",
      "question": "Why did Mr. Reyes write the e-mail?",
      "choices": [
        "To place a new order",
        "To request changes to an order",
        "To cancel an order",
        "To complain about a late delivery"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "전화번호 수정과 용지 변경을 요청하고 있으므로 기존 주문(Order #4471)의 변경을 요청하는 이메일입니다."
      },
      "vocabulary": [
        "quote",
        "proof"
      ],
      "grammar_point": "",
      "question_type": "목적",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p7-02",
      "day": 2,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d2-p7-psg1",
      "question": "What is suggested about Ms. Choi?",
      "choices": [
        "She works for a printing company.",
        "She is organizing a trade fair.",
        "She is Mr. Reyes's supervisor.",
        "She designed the company logo."
      ],
      "correct_answer": "A",
      "explanation": {
        "summary": "이메일 도메인(brightprint.com)과 카탈로그 시안(proof)을 보낸 사실로 보아 인쇄 회사 직원임을 추론할 수 있습니다."
      },
      "vocabulary": [
        "quote",
        "proof"
      ],
      "grammar_point": "",
      "question_type": "추론",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p7-03",
      "day": 2,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d2-p7-psg1",
      "question": "What does Mr. Reyes ask Ms. Choi to send?",
      "choices": [
        "A sample of glossy paper",
        "A list of trade fair participants",
        "A new price estimate and proof",
        "The original catalog files"
      ],
      "correct_answer": "C",
      "explanation": {
        "summary": "'Please send us a revised quote along with an updated proof.' quote(견적)가 보기에서 price estimate로 패러프레이징되었습니다."
      },
      "vocabulary": [
        "quote",
        "proof"
      ],
      "grammar_point": "",
      "question_type": "세부 정보",
      "source": "자체 제작"
    },
    {
      "question_id": "d2-p7-04",
      "day": 2,
      "part": 7,
      "difficulty": 1,
      "passage_id": "d2-p7-psg1",
      "question": "By when does Harbor Logistics need to receive the catalogs?",
      "choices": [
        "March 3",
        "March 17",
        "March 20",
        "March 30"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "'we would need to receive them no later than March 17'. March 20은 박람회 날짜이므로 함정입니다."
      },
      "vocabulary": [
        "quote",
        "proof"
      ],
      "grammar_point": "",
      "question_type": "세부 정보",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-04",
      "day": 1,
      "part": 7,
      "difficulty": 1,
      "passage_id": "d1-p7-psg2",
      "question": "What problem does Ms. Lee mention?",
      "choices": [
        "She is late for a meeting.",
        "Some equipment is not working.",
        "A client canceled a presentation.",
        "A room has been double-booked."
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "'The projector in Conference Room B isn't working' — 프로젝터(equipment)가 작동하지 않는 것이 문제입니다."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "세부 정보",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-05",
      "day": 1,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d1-p7-psg2",
      "question": "At 9:16 A.M., what does Mr. Baker most likely mean when he writes, \"I have a portable one in my car\"?",
      "choices": [
        "He wants to sell a device.",
        "He can provide a replacement projector.",
        "He forgot something in his car.",
        "He will drive Ms. Lee to the client's office."
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "고장 난 프로젝터 이야기 직후의 말이므로, 휴대용 프로젝터를 대신 가져다줄 수 있다는 의미입니다. 의도 파악 문제는 앞뒤 대화 흐름이 핵심입니다."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "문장 의미",
      "source": "자체 제작"
    },
    {
      "question_id": "d1-p7-06",
      "day": 1,
      "part": 7,
      "difficulty": 2,
      "passage_id": "d1-p7-psg2",
      "question": "What will Ms. Lee most likely do next?",
      "choices": [
        "Cancel her presentation",
        "Contact the IT department",
        "Go to the client's office",
        "Buy a new projector"
      ],
      "correct_answer": "B",
      "explanation": {
        "summary": "마지막 메시지 'I'll let the IT department know ...'에서 IT 부서에 연락할 것임을 알 수 있습니다."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "추론",
      "source": "자체 제작"
    }
  ]
};
