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
        "summary": "조동사 will 뒤에는 동사원형이 와야 합니다. 목적어 the new product를 취하는 동사 introduce가 정답입니다.",
        "evidence": "빈칸 앞 조동사 will → 뒤에는 동사원형. 빈칸 뒤 the new product가 목적어이므로 타동사가 필요합니다.",
        "structure": "The marketing team(주어) + will introduce(동사) + the new product(목적어) + at next month's trade show(장소 수식어)",
        "wrong_choices": {
          "B": "introduction은 명사라 조동사 will 뒤 동사 자리에 올 수 없습니다.",
          "C": "introductory는 형용사(입문의)로 동사 자리에 올 수 없습니다.",
          "D": "introduced는 과거형/과거분사라 will 뒤에 바로 올 수 없습니다."
        },
        "tip": "조동사(will, can, must, should) 뒤는 무조건 동사원형. 보기가 같은 어근의 품사 변형이면 빈칸 앞뒤만 보고 자리부터 판단하세요."
      },
      "vocabulary": [
        "introduce",
        "trade show"
      ],
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
        "summary": "현재완료(has worked)와 함께 과거의 특정 시점(2015)을 나타낼 때는 since를 씁니다. for는 기간(for five years) 앞에 씁니다.",
        "evidence": "현재완료 has worked + 과거의 시작 시점(2015) → since.",
        "structure": "Ms. Park(주어) + has worked(현재완료) + at the company + since 2015(시작 시점)",
        "wrong_choices": {
          "A": "for는 기간(for ten years) 앞에 씁니다. 2015는 기간이 아니라 시점입니다.",
          "C": "during은 특정 기간 동안(during the meeting)이며 연도 하나와는 어울리지 않습니다.",
          "D": "within은 '~ 이내에'(within two weeks)로 기간 표현과 씁니다."
        },
        "tip": "현재완료 문장에서 빈칸 뒤가 시점(연도·날짜)이면 since, 기간(숫자+단위)이면 for."
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
        "summary": "제출(submit)처럼 한 번에 끝나는 동작의 기한은 by(~까지)를 씁니다. until은 상태나 동작이 계속될 때(stay until Friday) 씁니다.",
        "evidence": "submit(제출하다)은 한 번에 끝나는 동작 → 기한은 by(~까지).",
        "structure": "All employees(주어) + must submit(동사) + their expense reports(목적어) + by Friday(기한)",
        "wrong_choices": {
          "B": "until은 상태·동작이 계속되다가 끝나는 시점에 씁니다(stay until Friday). 제출은 계속되는 동작이 아닙니다.",
          "C": "on Friday는 '금요일에'라는 뜻으로 마감 기한 의미가 없습니다.",
          "D": "at은 시각(at 5 P.M.) 앞에 씁니다."
        },
        "tip": "by vs until: 동사가 한 번 하고 끝나는 동작(submit, finish, return)이면 by, 계속되는 상태(wait, stay, keep)면 until."
      },
      "vocabulary": [
        "submit",
        "expense report"
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
        "summary": "빈칸 뒤가 명사구(the heavy rain)이므로 전치사가 필요합니다. 의미상 '~에도 불구하고'인 Despite가 정답입니다. Although와 Because는 접속사라 절이 와야 합니다.",
        "evidence": "빈칸 뒤가 명사구(the heavy rain)이고, 의미가 '폭우에도 불구하고' → 전치사 Despite.",
        "structure": "[Despite + 명사구], 주절: the outdoor concert(주어) + was held(수동태 동사) + as scheduled",
        "wrong_choices": {
          "A": "Although는 접속사라 뒤에 주어+동사가 있는 절이 와야 합니다.",
          "C": "Because는 접속사이며 의미도 '때문에'라서 맞지 않습니다(because of라면 전치사).",
          "D": "Even은 부사라 명사구를 이끌 수 없습니다(even though라면 접속사)."
        },
        "tip": "양보 표현은 뒤를 먼저 보세요. 명사(구)면 despite / in spite of, 절이면 although / though / even though."
      },
      "vocabulary": [
        "as scheduled"
      ],
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
        "summary": "ask, request, require 같은 요구 동사 뒤 that절에서는 (should +) 동사원형을 씁니다. 보고서는 '검토되는' 대상이므로 수동형 be reviewed가 정답입니다.",
        "evidence": "요구 동사 asked 뒤 that절 → (should) + 동사원형. 보고서는 검토되는 대상 → be reviewed.",
        "structure": "The manager asked [that every report (should) be reviewed carefully before submission]",
        "wrong_choices": {
          "A": "reviews는 3인칭 단수 현재형이라 당위의 that절 규칙(동사원형)에 맞지 않고, 능동이라 의미도 틀립니다.",
          "B": "is reviewed는 직설법이라 요구 동사 뒤 that절에 쓰지 않습니다.",
          "D": "reviewing은 동명사/현재분사로 that절의 동사 자리에 올 수 없습니다."
        },
        "tip": "ask, request, require, recommend, suggest, insist + that + 주어 + (should) 동사원형. 수동이면 be p.p."
      },
      "vocabulary": [
        "submission"
      ],
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
        "summary": "빈칸 뒤에 명사(qualifications)가 바로 오고, '그 후보자의 자격'이라는 소유 관계이므로 소유격 관계대명사 whose가 정답입니다.",
        "evidence": "빈칸 뒤에 관사 없는 명사 qualifications가 바로 오고 '그 후보자의 자격' → 소유격 whose.",
        "structure": "Mr. Kim is the candidate [whose qualifications(주어) best match(동사) the job description(목적어)]",
        "wrong_choices": {
          "A": "who는 주격이라 뒤에 동사가 바로 와야 합니다. 여기는 명사가 이어집니다.",
          "B": "whom은 목적격이라 뒤에 주어+동사가 오고 목적어가 빠진 절이 와야 합니다.",
          "D": "which는 사물을 받으며, 선행사 the candidate는 사람입니다."
        },
        "tip": "관계대명사 + 명사 + 동사 형태가 보이면 whose. 관계사 뒤에 완전한 절의 일부로 명사가 붙어 있는지 확인하세요."
      },
      "vocabulary": [
        "qualification",
        "job description"
      ],
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
        "summary": "비교급(easier)을 강조할 때는 much, even, far, still, a lot을 씁니다. very는 원급만 수식하고, easier는 이미 비교급이라 more를 붙일 수 없습니다.",
        "evidence": "빈칸 뒤 easier는 비교급(than이 단서) → 비교급 강조 부사 much.",
        "structure": "The new software(주어) + is(동사) + much easier to use(보어) + than the previous version",
        "wrong_choices": {
          "A": "very는 원급(very easy)만 꾸밉니다. 비교급 앞에는 쓸 수 없습니다.",
          "C": "easier가 이미 비교급이라 more를 또 붙일 수 없습니다.",
          "D": "most는 최상급 표현이라 비교급·than과 함께 쓸 수 없습니다."
        },
        "tip": "비교급 강조: much, even, far, still, a lot. very는 원급용이라 비교급 앞에 오면 오답입니다."
      },
      "vocabulary": [
        "previous"
      ],
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
        "summary": "'~로서'라는 자격이나 역할을 나타낼 때는 as를 씁니다. keep A as B: A를 B로서 보관하다.",
        "evidence": "keep A as B: A를 B로서 보관하다. 영수증의 역할(구매 증빙)을 나타내는 as.",
        "structure": "Customers [who wish to return an item](주어) + should keep(동사) + the receipt(목적어) + as proof of purchase(자격)",
        "wrong_choices": {
          "B": "for는 목적·대상(~을 위해)이라 '증빙으로서'라는 자격의 의미가 아닙니다.",
          "C": "like는 '~처럼(실제로는 아닌데 비슷한)'이라 영수증이 실제 증빙인 문맥과 맞지 않습니다.",
          "D": "with는 '~와 함께'라 의미가 통하지 않습니다."
        },
        "tip": "as는 '~로서(실제 자격)', like는 '~처럼(비유)'. 문장의 대상이 실제로 그 역할을 하는지 확인하세요."
      },
      "vocabulary": [
        "receipt",
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
        "summary": "과거분사 impressed를 수식하는 자리이므로 부사 favorably가 정답입니다.",
        "evidence": "수동태 were impressed 사이, 과거분사 impressed를 꾸미는 자리 → 부사 favorably.",
        "structure": "The board members(주어) + were favorably impressed(수동태 동사 + 부사) + by the quarterly results",
        "wrong_choices": {
          "A": "favor는 명사/동사라 be동사와 과거분사 사이에 들어갈 수 없습니다.",
          "B": "favorable은 형용사라 분사(동사 성격)를 꾸밀 수 없습니다.",
          "D": "favorability는 명사라 수식어 자리에 맞지 않습니다."
        },
        "tip": "be + ___ + p.p. / have + ___ + p.p.처럼 동사 덩어리 사이 빈칸은 거의 항상 부사(-ly)입니다."
      },
      "vocabulary": [
        "quarterly"
      ],
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
        "summary": "상관접속사 neither A nor B(A도 B도 아닌) 구문입니다. either A or B, both A and B, not only A but (also) B도 함께 외워 두세요.",
        "evidence": "문장 앞의 Neither와 짝을 이루는 nor. neither A nor B.",
        "structure": "Neither the director nor her assistant(주어) + was(동사) + available for comment",
        "wrong_choices": {
          "A": "or는 either와 짝입니다(either A or B).",
          "B": "and는 both와 짝입니다(both A and B).",
          "D": "but은 not only와 짝입니다(not only A but also B)."
        },
        "tip": "상관접속사는 앞 단어가 정답을 정합니다: both–and, either–or, neither–nor, not only–but (also), whether–or."
      },
      "vocabulary": [
        "available"
      ],
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
        "summary": "빈칸 뒤가 절(주어 + 동사)이므로 접속사가 필요합니다. once는 '일단 ~하면'이라는 뜻의 접속사입니다. during, despite, regarding은 전치사입니다.",
        "evidence": "빈칸 뒤가 절(the deadline has passed) → 접속사 필요. once = 일단 ~하면/~하자마자.",
        "structure": "Applications(주어) + will not be accepted(수동태 동사) + [once the deadline has passed](부사절)",
        "wrong_choices": {
          "B": "during은 전치사라 뒤에 절이 올 수 없습니다.",
          "C": "despite는 전치사이며 의미(~에도 불구하고)도 맞지 않습니다.",
          "D": "regarding은 '~에 관하여'라는 전치사라 절을 이끌 수 없습니다."
        },
        "tip": "once는 접속사로 자주 출제됩니다(once you register, …). 빈칸 뒤 주어+동사가 있으면 전치사 보기부터 지우세요."
      },
      "vocabulary": [
        "application",
        "deadline",
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
        "summary": "Please로 시작하는 명령문이므로 동사원형이 와야 합니다. and 뒤의 return과도 병렬 구조를 이룹니다.",
        "evidence": "Please로 시작하는 명령문 → 동사원형. and 뒤 return과 병렬.",
        "structure": "Please + sign(동사원형) + the attached document(목적어) + and return it by e-mail",
        "wrong_choices": {
          "B": "signature는 명사라 명령문의 동사 자리에 올 수 없습니다.",
          "C": "signing은 동명사/분사로 명령문 동사가 될 수 없습니다.",
          "D": "signed는 과거형/과거분사라 명령문에 맞지 않습니다."
        },
        "tip": "Please 뒤 빈칸은 동사원형. and/or로 연결된 다른 동사의 형태(return)도 함께 확인하세요."
      },
      "vocabulary": [
        "attached"
      ],
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
        "summary": "형용사 ill을 수식하는 자리이므로 부사 suddenly가 정답입니다.",
        "evidence": "형용사 ill(아픈)을 꾸미는 자리 → 부사 suddenly.",
        "structure": "The training session was postponed + [because the instructor(주어) was(동사) suddenly ill(보어)]",
        "wrong_choices": {
          "A": "sudden은 형용사라 다른 형용사 ill을 꾸밀 수 없습니다.",
          "C": "suddenness는 명사라 이 자리에 맞지 않습니다.",
          "D": "more sudden은 형용사 비교급이라 형용사를 꾸밀 수 없습니다."
        },
        "tip": "형용사 앞 빈칸은 부사. be동사 뒤라고 무조건 형용사를 고르지 말고, 바로 뒤에 형용사가 있는지 보세요."
      },
      "vocabulary": [
        "postpone",
        "instructor"
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
        "summary": "By the time + 현재시제(arrives)는 미래를 나타내고, 그 시점까지 완료될 일은 미래완료(will have p.p.)로 씁니다.",
        "evidence": "By the time + 현재시제(미래 의미) → 그 시점까지 완료될 일은 미래완료 will have p.p.",
        "structure": "[By the time the shipment arrives](시간 부사절) + we(주어) + will have completed(미래완료) + the warehouse renovation(목적어)",
        "wrong_choices": {
          "A": "complete(현재)는 미래 시점까지의 완료를 나타내지 못합니다.",
          "B": "completed(과거)는 arrives(미래 의미)와 시간이 맞지 않습니다.",
          "D": "have completed(현재완료)는 지금까지의 완료라 미래 시점 기준이 아닙니다."
        },
        "tip": "By the time + 현재 → 주절 미래완료(will have p.p.), By the time + 과거 → 주절 과거완료(had p.p.)."
      },
      "vocabulary": [
        "renovation",
        "shipment",
        "warehouse"
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
        "summary": "refrain from -ing는 '~을 삼가다'라는 뜻의 관용 표현입니다. prevent/prohibit A from -ing와 함께 외워 두세요.",
        "evidence": "refrain from -ing: ~을 삼가다. 빈칸 뒤 using이 동명사인 것도 단서.",
        "structure": "Participants(주어) + are asked to refrain(동사) + from using their mobile phones(전치사구) + during the presentation",
        "wrong_choices": {
          "A": "refrain to는 쓰지 않습니다. to 뒤라면 동사원형이 와야 하는데 using이 있습니다.",
          "C": "refrain of는 존재하지 않는 결합입니다.",
          "D": "refrain with도 쓰지 않는 결합입니다."
        },
        "tip": "from + -ing 짝꿍: refrain from, prevent/prohibit/keep A from, discourage A from. 동사와 전치사를 한 덩어리로 외우세요."
      },
      "vocabulary": [
        "refrain from"
      ],
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
        "summary": "expand A to B는 'A를 B로 확장하다'라는 뜻입니다. inform은 사람을 목적어로 취하고, attend는 '참석하다', remain은 자동사입니다.",
        "evidence": "expand A to B: A를 B로 확장하다. 목적어 its operations와 to Southeast Asia가 단서.",
        "structure": "The company(주어) + plans to expand(동사) + its operations(목적어) + to Southeast Asia + next year",
        "wrong_choices": {
          "B": "inform은 사람을 목적어로 씁니다(inform A of B). operations를 알릴 수는 없습니다.",
          "C": "attend는 '참석하다'라서 operations와 의미가 맞지 않습니다.",
          "D": "remain은 자동사라 목적어 its operations를 가질 수 없습니다."
        },
        "tip": "어휘 문제는 빈칸 뒤 목적어·전치사와의 결합(expand A to B)으로 확인하세요. 해석만으로 고르면 함정에 빠집니다."
      },
      "vocabulary": [
        "expand",
        "operations"
      ],
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
        "summary": "명사 demand를 수식하는 형용사 자리입니다. 수요가 '압도적인'이라는 능동의 의미이므로 현재분사 overwhelming이 정답입니다.",
        "evidence": "명사 demand를 꾸미는 형용사 자리. 수요가 '압도하는' 능동 의미 → 현재분사 overwhelming.",
        "structure": "[Due to overwhelming demand](이유 전치사구), the limited edition(주어) + sold out(동사) + within hours",
        "wrong_choices": {
          "A": "overwhelm은 동사원형이라 명사를 꾸밀 수 없습니다.",
          "C": "overwhelmed는 '압도당한'(사람의 감정)이라 수요를 꾸밀 때는 어색합니다.",
          "D": "overwhelms는 3인칭 단수 동사라 수식어 자리에 맞지 않습니다."
        },
        "tip": "감정·영향 동사의 분사: 원인(사물)은 -ing(overwhelming demand), 느끼는 사람은 -ed(overwhelmed staff)."
      },
      "vocabulary": [
        "demand",
        "sell out"
      ],
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
        "summary": "Each of + 복수명사는 단수 취급하므로 is를 씁니다. 인턴은 멘토를 '배정받는' 쪽이므로 수동태 is assigned가 정답입니다.",
        "evidence": "Each of + 복수명사 → 단수 취급(is). 인턴은 멘토를 배정받는 쪽 → 수동태 is assigned.",
        "structure": "Each of the new interns(주어, 단수) + is assigned(수동태 동사) + a mentor + for the first three months",
        "wrong_choices": {
          "A": "assign은 주어(Each, 단수)와 수가 맞지 않고, 능동이라 '인턴이 배정한다'가 됩니다.",
          "B": "are assigned는 복수 동사라 Each와 수일치가 맞지 않습니다.",
          "D": "assigning은 동사 자리에 단독으로 올 수 없습니다."
        },
        "tip": "Each / Every / One of + 복수명사 → 단수 동사. 수일치와 능동·수동을 함께 확인하세요."
      },
      "vocabulary": [
        "assign"
      ],
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
        "summary": "선행사가 사람(guests)이고, 빈칸 뒤에 주어가 없이 동사(stay)가 바로 나오므로 주격 관계대명사 who가 정답입니다.",
        "evidence": "선행사 guests(사람) + 빈칸 뒤 주어 없이 동사 stay → 주격 관계대명사 who.",
        "structure": "The hotel offers complimentary breakfast to guests [who stay for more than three nights]",
        "wrong_choices": {
          "B": "which는 사물을 받는데 선행사 guests는 사람입니다.",
          "C": "what은 선행사를 포함하므로 앞에 명사(guests)가 있으면 쓸 수 없습니다.",
          "D": "whose는 뒤에 명사가 와야 하는데 동사 stay가 이어집니다."
        },
        "tip": "관계사 문제 순서: ① 선행사가 사람/사물인지 ② 빈칸 뒤에 무엇이 빠졌는지(주어 → 주격, 목적어 → 목적격, 명사 → whose)."
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
        "summary": "복수 가산명사 questions 앞에 올 수 있고 if절에 잘 쓰이는 any가 정답입니다. much는 불가산명사, every와 another는 단수명사 앞에 씁니다.",
        "evidence": "복수 가산명사 questions 앞 + if 조건절 → any.",
        "structure": "Please contact our customer service department + [if you have any questions]",
        "wrong_choices": {
          "B": "much는 불가산명사 앞에 씁니다(much information).",
          "C": "every는 단수명사 앞에 씁니다(every question).",
          "D": "another는 단수명사 앞에 씁니다(another question)."
        },
        "tip": "수량 형용사는 뒤 명사의 수가 정답을 정합니다: 복수 → many, few, several, any / 단수 → every, each, another / 불가산 → much, little."
      },
      "vocabulary": [
        "inquiry"
      ],
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
        "summary": "수동태 동사 be reviewed를 수식하는 자리이므로 부사 thoroughly가 정답입니다.",
        "evidence": "수동태 must be reviewed 뒤, 동사를 꾸미는 자리 → 부사 thoroughly.",
        "structure": "The financial report(주어) + must be reviewed thoroughly(동사 + 부사) + [before it is released to shareholders]",
        "wrong_choices": {
          "A": "thorough는 형용사라 동사를 꾸밀 수 없습니다.",
          "C": "thoroughness는 명사로 이 자리에 맞지 않습니다.",
          "D": "more thorough는 형용사 비교급이라 동사를 꾸밀 수 없습니다."
        },
        "tip": "완전한 문장(주어+동사, 수동태라 목적어 불필요) 뒤에 붙는 빈칸은 부사입니다."
      },
      "vocabulary": [
        "thoroughly",
        "shareholder"
      ],
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
        "summary": "빈칸 뒤가 명사구(her outstanding sales performance)이므로 전치사가 필요합니다. '~ 때문에'라는 뜻의 due to가 정답입니다. because는 접속사입니다.",
        "evidence": "빈칸 뒤 명사구(her outstanding sales performance) + 이유 → 전치사 due to.",
        "structure": "Ms. Lopez(주어) + was promoted(수동태 동사) + to regional manager + [due to her outstanding sales performance]",
        "wrong_choices": {
          "A": "because는 접속사라 절이 와야 합니다(because of라면 가능).",
          "C": "although는 접속사이며 의미(~이지만)도 맞지 않습니다.",
          "D": "so that은 목적(~하도록)을 나타내는 접속사로 절이 와야 합니다."
        },
        "tip": "이유 표현: 명사 앞 because of / due to / owing to, 절 앞 because / since / as."
      },
      "vocabulary": [
        "promote",
        "outstanding"
      ],
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
        "summary": "업무(operations)는 '방해받는' 대상이므로 will not be 뒤에 과거분사 interrupted를 써서 수동태를 만듭니다.",
        "evidence": "will not be 뒤 + 업무(operations)는 방해받는 대상 → 과거분사 interrupted(수동태).",
        "structure": "so that normal business operations(주어) + will not be interrupted(수동태 동사)",
        "wrong_choices": {
          "A": "interrupt는 동사원형이라 be 뒤에 올 수 없습니다.",
          "C": "interrupting은 능동 진행이라 '업무가 방해한다'는 어색한 의미가 됩니다.",
          "D": "interruption은 명사로, '업무가 방해 그 자체다'라는 뜻이 되어 맞지 않습니다."
        },
        "tip": "Part 6 문법 빈칸도 Part 5와 같습니다. 주어가 동작을 하는지 받는지(능동/수동)를 먼저 판단하세요."
      },
      "vocabulary": [
        "interrupt",
        "relocation"
      ],
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
        "summary": "상자는 시설팀에 의해 '제공되는' 것이므로 과거분사 provided가 명사 boxes를 뒤에서 수식합니다. 뒤의 by the facilities team이 단서입니다.",
        "evidence": "상자는 시설팀에 의해 제공되는 것 → 과거분사 provided가 boxes를 뒤에서 수식. by the facilities team이 단서.",
        "structure": "Please pack your personal belongings in the boxes [provided by the facilities team]",
        "wrong_choices": {
          "A": "provide는 동사원형이라 명사를 뒤에서 꾸밀 수 없습니다.",
          "B": "providing은 능동이라 '상자가 제공한다'는 뜻이 됩니다. 뒤의 by도 수동을 가리킵니다.",
          "D": "provides는 동사라 이미 동사(pack)가 있는 문장에 또 올 수 없습니다."
        },
        "tip": "명사 + ___ + by ~ 구조는 과거분사(p.p.)가 거의 확실합니다."
      },
      "vocabulary": [
        "belongings"
      ],
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
        "summary": "앞 문장은 짐 싸는 방법을, 뒤 문장은 '추가(additional) 물품'이 필요하면 연락하라는 내용입니다. 기본 포장 물품의 배포 일정을 알리는 (A)가 자연스럽게 이어집니다.",
        "evidence": "앞 문장: 짐 싸는 방법(박스·라벨), 뒤 문장: 추가(additional) 물품이 필요하면 연락. 기본 포장 물품 배포 안내가 들어가야 '추가'가 자연스럽습니다.",
        "structure": "흐름: ① 이전 일정 → ② 박스에 짐 싸기 → ③ [포장 물품 배포 일정] → ④ 추가 물품 문의처 → ⑤ 인사",
        "wrong_choices": {
          "B": "새 건물의 주차장 이야기는 짐 싸기 안내와 추가 물품 문의 사이에 들어갈 이유가 없습니다.",
          "C": "회사 설립 연도는 사무실 이전 안내의 흐름과 무관합니다.",
          "D": "어제 회의 참석 감사는 공지 중간에 들어갈 내용이 아닙니다."
        },
        "tip": "문장 삽입은 빈칸 앞뒤 문장의 연결어(additional, also, however, this 등)를 먼저 찾으세요. 뒤 문장이 앞 내용을 전제로 하는지가 핵심입니다."
      },
      "vocabulary": [
        "extension"
      ],
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
        "summary": "look forward to의 to는 전치사이므로 뒤에 동명사가 옵니다. look forward to -ing: ~하기를 고대하다.",
        "evidence": "look forward to의 to는 전치사 → 뒤에 동명사 welcoming.",
        "structure": "We appreciate your cooperation and + look forward to welcoming you in our new workspace",
        "wrong_choices": {
          "A": "welcome(동사원형)은 to부정사의 to로 착각한 함정입니다. 여기 to는 전치사입니다.",
          "C": "welcomed(과거분사)는 전치사 뒤에 올 수 없습니다.",
          "D": "welcomes는 동사라 전치사 뒤에 올 수 없습니다."
        },
        "tip": "to + -ing 표현: look forward to, be committed to, be dedicated to, contribute to, be used to(~에 익숙하다)."
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
        "summary": "문장에 동사가 없으므로 본동사가 필요합니다. 공사는 이미 끝나고 재개관을 앞둔 상황이므로 과거시제 included가 정답입니다. 주어가 단수(The project)라 include는 수일치가 맞지 않습니다.",
        "evidence": "문장에 본동사가 없음 → 동사 필요. 공사는 끝나고 재개관을 앞둔 상황 → 과거 included. 주어 The project는 단수.",
        "structure": "The project(주어) + included(동사) + new seating, improved lighting, and additional power outlets(목적어)",
        "wrong_choices": {
          "A": "include는 복수·현재형이라 단수 주어 The project와 맞지 않고, 끝난 공사와 시제도 맞지 않습니다.",
          "C": "including은 동사가 아니라 전치사/분사로 문장의 본동사가 될 수 없습니다.",
          "D": "to include는 to부정사라 본동사 자리에 올 수 없습니다."
        },
        "tip": "Part 6는 지문 전체의 시점(재개관 예정 = 공사는 완료)을 보고 시제를 고르세요. 문장 하나만 보면 함정에 빠집니다."
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
        "summary": "앞 문단의 시설 개선에 이어 운영 시간 연장이라는 또 하나의 좋은 소식을 덧붙이므로 '게다가'라는 뜻의 In addition이 알맞습니다.",
        "evidence": "앞 단락: 시설 개선(좋은 소식) → 빈칸 뒤: 운영 시간 연장(또 하나의 좋은 소식) → 추가 In addition.",
        "structure": "[In addition], the library(주어) + has extended(동사) + its weekday hours(목적어) + until 9 P.M.",
        "wrong_choices": {
          "B": "However는 앞 내용과 반대될 때 씁니다. 두 소식 모두 긍정적이라 대조가 아닙니다.",
          "C": "Otherwise는 '그렇지 않으면'이라 조건 문맥에 씁니다.",
          "D": "Instead는 앞 내용을 대신할 때 씁니다. 시설 개선을 대신하는 것이 아닙니다."
        },
        "tip": "접속부사 문제는 앞뒤 문장의 관계를 한 단어로 정리하세요: 추가(In addition, Also), 대조(However), 결과(Therefore), 대체(Instead)."
      },
      "vocabulary": [
        "extend"
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
        "summary": "be encouraged to + 동사원형(~하도록 권장되다) 구문입니다.",
        "evidence": "be encouraged to + 동사원형(~하도록 권장되다).",
        "structure": "Visitors(주어) + are encouraged to explore(동사) + the new space(목적어) + during our open house",
        "wrong_choices": {
          "B": "exploring은 to 뒤에 올 수 없습니다(여기 to는 to부정사).",
          "C": "explored는 과거형/과거분사로 to 뒤에 올 수 없습니다.",
          "D": "exploration은 명사라 목적어 the new space를 가질 수 없습니다."
        },
        "tip": "be encouraged / allowed / required / expected / asked to + 동사원형. 수동태 뒤 to부정사 패턴을 묶어서 외우세요."
      },
      "vocabulary": [
        "open house"
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
        "summary": "바로 앞 문장이 오픈 하우스 행사를 안내하므로, 행사에서 제공될 다과와 가이드 투어를 소개하는 (A)가 자연스럽습니다.",
        "evidence": "바로 앞 문장이 오픈 하우스 행사 안내 → 행사에서 제공될 다과와 가이드 투어 소개가 자연스럽습니다.",
        "structure": "흐름: ① 재개관 소식 → ② 개선 내용 → ③ 운영 시간 연장 → ④ 오픈 하우스 초대 → ⑤ [행사 세부 내용]",
        "wrong_choices": {
          "B": "작년 예산 삭감으로 인한 휴관은 긍정적인 재개관 안내 흐름과 맞지 않습니다.",
          "C": "연체 도서 반납 독촉은 오픈 하우스 초대와 관련이 없습니다.",
          "D": "주차장 공사는 행사 안내 바로 뒤에 올 이유가 없습니다."
        },
        "tip": "마지막 빈칸 문장 삽입은 바로 앞 문장(여기서는 오픈 하우스)을 구체화하는 문장이 정답인 경우가 많습니다."
      },
      "vocabulary": [
        "refreshments"
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
        "summary": "제목의 Grand Opening과 'Our new facility'에서 새로 문을 연 피트니스 센터 광고임을 알 수 있습니다.",
        "evidence": "제목 'Grand Opening Special!'과 'Our new facility at 45 Maple Avenue' → 새로 문을 연 피트니스 센터 광고.",
        "structure": "지문 구조: 제목(무엇을) → 1단락 할인과 시설 → 2단락 혜택·추가 요금 → 3단락 가입 방법",
        "wrong_choices": {
          "B": "nutrition counseling은 회원 혜택 중 하나일 뿐 광고의 대상이 아닙니다.",
          "C": "운동 기구(equipment)는 시설 소개의 일부이고 판매하는 것이 아닙니다.",
          "D": "수영장(swimming pool)은 시설 중 하나이며 대회 이야기는 없습니다."
        },
        "tip": "주제 문제는 제목과 첫 1~2문장에 답이 있습니다. 지문 일부 단어만 맞는 보기(부분 정보)는 함정입니다."
      },
      "vocabulary": [
        "state-of-the-art"
      ],
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
        "summary": "'Personal training sessions are available for an additional fee.' 개인 트레이닝은 추가 요금이 듭니다. NOT 문제는 보기를 하나씩 지문과 대조해 지워 나가세요.",
        "evidence": "'Personal training sessions are available for an additional fee.' → 개인 트레이닝은 추가 요금.",
        "structure": "근거 위치: 2단락 마지막 문장",
        "wrong_choices": {
          "A": "'Members also enjoy free parking' — 무료로 포함됩니다.",
          "B": "'group classes ranging from yoga to kickboxing' — 시설 소개에 포함됩니다.",
          "D": "'access to our nutrition counseling service' — 회원 혜택에 포함됩니다."
        },
        "tip": "NOT 문제는 보기 4개를 지문과 하나씩 대조해 '있다'를 지워 나가세요. 남는 하나가 정답입니다."
      },
      "vocabulary": [
        "additional fee"
      ],
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
        "summary": "'Join ... before June 30 and receive 20% off' — 6월 30일 전에 가입하면 할인을 받습니다. 지문의 June 30이 보기에서 the end of June으로 바뀌어(패러프레이징) 나왔습니다.",
        "evidence": "'Join … before June 30 and receive 20% off' → 6월 말 전에 가입하면 할인.",
        "structure": "근거 위치: 1단락 첫 문장. 지문 before June 30 → 보기 before the end of June (패러프레이징)",
        "wrong_choices": {
          "A": "친구 동반 할인 이야기는 없습니다.",
          "C": "온라인 가입은 방법 중 하나일 뿐이며(front desk도 가능), 할인 조건이 아닙니다.",
          "D": "현금 결제 이야기는 없습니다."
        },
        "tip": "정답 보기는 지문 표현을 바꿔 말합니다(June 30 → the end of June). 지문 단어가 그대로 나온 보기를 먼저 의심하세요."
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
        "summary": "전화번호 수정과 용지 변경을 요청하고 있으므로 기존 주문(Order #4471)의 변경을 요청하는 이메일입니다.",
        "evidence": "전화번호 수정과 용지 변경을 요청 → 기존 주문(Order #4471)의 변경 요청.",
        "structure": "이메일 구조: 감사 인사 → 문제점(전화번호 오류) → 추가 요청(용지 변경, 견적·시안) → 일정 확인",
        "wrong_choices": {
          "A": "제목이 Order #4471이고 이미 시안을 받은 상태라 새 주문이 아닙니다.",
          "C": "취소가 아니라 수정해서 계속 진행하려는 내용입니다.",
          "D": "배송이 늦었다는 불만이 아니라, 앞으로 받을 날짜를 확인하고 있습니다."
        },
        "tip": "목적 문제는 첫 단락 + 'Unfortunately / I would like to / Please' 같은 요청 신호를 찾으세요. 감사 인사 문장은 목적이 아닌 경우가 많습니다."
      },
      "vocabulary": [
        "revised",
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
        "summary": "이메일 도메인(brightprint.com)과 카탈로그 시안(proof)을 보낸 사실로 보아 인쇄 회사 직원임을 추론할 수 있습니다.",
        "evidence": "Ms. Choi의 이메일 도메인 brightprint.com + 카탈로그 시안(proof)을 보낸 사람 → 인쇄 회사 직원으로 추론.",
        "structure": "근거: 받는 사람 주소(mchoi@brightprint.com) + 1단락 'the proof you sent yesterday'",
        "wrong_choices": {
          "B": "박람회를 여는 것은 Harbor Logistics(카탈로그 배포)이며 Ms. Choi와 무관합니다.",
          "C": "두 사람은 회사가 다릅니다(주문자와 인쇄 업체).",
          "D": "로고 디자인 이야기는 없습니다."
        },
        "tip": "추론(suggested/implied) 문제는 머리글(From/To/주소/직함)도 근거가 됩니다. 이메일 도메인은 자주 쓰이는 단서입니다."
      },
      "vocabulary": [
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
        "summary": "'Please send us a revised quote along with an updated proof.' quote(견적)가 보기에서 price estimate로 패러프레이징되었습니다.",
        "evidence": "'Please send us a revised quote along with an updated proof.' → quote(견적) = price estimate.",
        "structure": "근거 위치: 2단락 마지막 문장. revised quote → new price estimate, updated proof → proof",
        "wrong_choices": {
          "A": "광택지로 바꾸고 싶다고 했지만 샘플을 요청하지는 않았습니다.",
          "B": "박람회 참가자 명단은 언급되지 않았습니다.",
          "D": "원본 파일 요청은 없습니다."
        },
        "tip": "quote(견적), estimate(견적), proof(시안), invoice(청구서), receipt(영수증)는 Part 7 단골 비즈니스 어휘입니다."
      },
      "vocabulary": [
        "quote",
        "revised"
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
        "summary": "'we would need to receive them no later than March 17'. March 20은 박람회 날짜이므로 함정입니다.",
        "evidence": "'we would need to receive them no later than March 17' → 늦어도 3월 17일까지.",
        "structure": "근거 위치: 3단락. no later than = by(늦어도 ~까지)",
        "wrong_choices": {
          "A": "March 3은 이메일을 보낸 날짜입니다.",
          "C": "March 20은 박람회 날짜입니다. 받아야 하는 날짜가 아닙니다(함정).",
          "D": "March 30은 지문에 없습니다."
        },
        "tip": "날짜가 여러 개 나오면 각 날짜에 무슨 일이 있는지 표시해 두세요. 질문의 동사(receive)와 지문의 동사가 같은 날짜가 정답입니다."
      },
      "vocabulary": [
        "no later than",
        "distribute"
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
        "summary": "'The projector in Conference Room B isn't working' — 프로젝터(equipment)가 작동하지 않는 것이 문제입니다.",
        "evidence": "'The projector in Conference Room B isn't working' → 장비(equipment)가 작동하지 않음.",
        "structure": "근거 위치: 9:15 A.M. Jenny Lee의 메시지. projector → equipment (상위어로 바꿔 말하기)",
        "wrong_choices": {
          "A": "Ms. Lee는 10시 발표가 있다고 했을 뿐 늦었다는 말은 없습니다.",
          "C": "고객이 발표를 취소한 것이 아니라 Mr. Baker의 고객 회의가 끝났습니다.",
          "D": "회의실 중복 예약 이야기는 없습니다."
        },
        "tip": "Part 7은 구체적인 단어(projector)를 일반적인 단어(equipment)로 바꿔 보기를 만듭니다."
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
        "summary": "고장 난 프로젝터 이야기 직후의 말이므로, 휴대용 프로젝터를 대신 가져다줄 수 있다는 의미입니다. 의도 파악 문제는 앞뒤 대화 흐름이 핵심입니다.",
        "evidence": "프로젝터 고장(9:15) 직후 'I have a portable one' → 휴대용 프로젝터를 대신 가져다줄 수 있다. 이어서 Ms. Lee가 'That would be great!'라고 답함.",
        "structure": "흐름: 문제 제기(9:15) → 해결책 제시(9:16, 인용 문장) → 수락(9:16) → 도착 시간(9:18)",
        "wrong_choices": {
          "A": "판매 의도는 없습니다. 문제 해결을 도와주려는 제안입니다.",
          "C": "물건을 두고 왔다는 의미가 아니라 가지고 있다는 뜻입니다.",
          "D": "Ms. Lee를 고객 사무실로 데려간다는 내용은 없습니다. Mr. Baker가 돌아옵니다."
        },
        "tip": "의도 파악 문제는 인용 문장의 바로 앞 문장(무슨 상황인지)과 바로 뒤 문장(상대가 어떻게 반응했는지)을 함께 읽으세요."
      },
      "vocabulary": [
        "portable",
        "replacement"
      ],
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
        "summary": "마지막 메시지 'I'll let the IT department know ...'에서 IT 부서에 연락할 것임을 알 수 있습니다.",
        "evidence": "마지막 메시지 'I'll let the IT department know they don't need to send anyone.' → IT 부서에 연락.",
        "structure": "근거 위치: 9:19 A.M. 마지막 메시지. I'll ~ = 앞으로 할 행동",
        "wrong_choices": {
          "A": "프로젝터를 구했으니 발표를 취소할 이유가 없습니다.",
          "C": "고객 사무실에 있던 사람은 Mr. Baker입니다.",
          "D": "Mr. Baker가 휴대용 프로젝터를 가져오므로 살 필요가 없습니다."
        },
        "tip": "'다음에 할 일' 문제는 대화·글의 마지막 부분에서 I'll / I will / Let me 같은 미래 표현을 찾으세요."
      },
      "vocabulary": [],
      "grammar_point": "",
      "question_type": "추론",
      "source": "자체 제작"
    }
  ]
};
