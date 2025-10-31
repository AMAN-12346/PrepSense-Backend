// utils/populateExamData.js
const ExamHierarchy = require('../models/ExamHierarchy');

// MVP Exam Data for PrepSense.ai
const mvpExamData = {
  
  // 1. POLICE CATEGORY
  police: {
    level0: {
      name: "POLICE",
      displayName: "Police & Security Forces",
      code: "POLICE",
      level: 0,
      hierarchyPath: ["POLICE"],
      icon: "👮‍♂️",
      color: "#DC2626",
      description: "Police recruitment exams across India - State and Central forces",
      preparationStats: {
        studentsPreparingCount: 450000,
        popularityScore: 95,
        difficultyLevel: "medium"
      }
    },
    level1: [
      {
        name: "STATE_POLICE",
        displayName: "State Police Forces",
        code: "STATE_POLICE", 
        level: 1,
        hierarchyPath: ["POLICE", "STATE_POLICE"],
        description: "State-wise police recruitment",
        examScope: "state-specific"
      },
      {
        name: "CENTRAL_FORCES",
        displayName: "Central Armed Police Forces",
        code: "CENTRAL_FORCES",
        level: 1, 
        hierarchyPath: ["POLICE", "CENTRAL_FORCES"],
        description: "BSF, CRPF, CISF, ITBP recruitment",
        examScope: "all-india",
        applicableStates: ["All India"]
      }
    ],
    level2: [
      // Delhi Police
      {
        name: "DELHI_POLICE_CONSTABLE",
        displayName: "Delhi Police Constable", 
        code: "DELHI_POLICE_CONSTABLE",
        level: 2,
        hierarchyPath: ["POLICE", "STATE_POLICE", "DELHI_POLICE_CONSTABLE"],
        description: "Delhi Police Constable recruitment",
        examScope: "state-specific",
        applicableStates: ["Delhi"],
        examDetails: {
          frequency: "yearly",
          eligibility: {
            ageMin: 18,
            ageMax: 27,
            education: ["12th"]
          },
          examPattern: {
            stages: ["Computer Based Test", "Physical Test", "Medical Test"],
            duration: 90,
            totalMarks: 100,
            totalQuestions: 100,
            negativeMarking: true,
            negativeMarks: 0.25,
            sections: [
              { name: "General Knowledge", marks: 35, questions: 35, difficultyLevel: "medium" },
              { name: "English", marks: 25, questions: 25, difficultyLevel: "easy" },
              { name: "Mathematics", marks: 25, questions: 25, difficultyLevel: "medium" },
              { name: "Reasoning", marks: 15, questions: 15, difficultyLevel: "medium" }
            ]
          },
          syllabus: {
            subjects: ["General Knowledge", "English", "Mathematics", "Reasoning"],
            detailedSyllabus: [
              {
                subject: "General Knowledge",
                topics: ["Indian History", "Geography", "Polity", "Current Affairs", "Sports"],
                weightage: 35,
                difficulty: "medium"
              },
              {
                subject: "English",
                topics: ["Grammar", "Vocabulary", "Comprehension", "Error Detection"],
                weightage: 25,
                difficulty: "easy"
              },
              {
                subject: "Mathematics",
                topics: ["Arithmetic", "Algebra", "Geometry", "Data Interpretation"],
                weightage: 25,
                difficulty: "medium"
              },
              {
                subject: "Reasoning",
                topics: ["Logical Reasoning", "Verbal Reasoning", "Non-Verbal Reasoning"],
                weightage: 15,
                difficulty: "medium"
              }
            ]
          }
        },
        preparationStats: {
          totalVacancies: 25000,
          expectedApplicants: 1500000,
          competitionRatio: "1:60",
          difficultyLevel: "medium",
          averagePreparationTime: 6,
          successRate: 1.67,
          popularityScore: 90
        }
      },
      
      // UP Police Constable
      {
        name: "UP_POLICE_CONSTABLE",
        displayName: "UP Police Constable",
        code: "UP_POLICE_CONSTABLE", 
        level: 2,
        hierarchyPath: ["POLICE", "STATE_POLICE", "UP_POLICE_CONSTABLE"],
        examScope: "state-specific",
        applicableStates: ["Uttar Pradesh"],
        examDetails: {
          frequency: "yearly",
          eligibility: { ageMin: 18, ageMax: 22, education: ["12th"] },
          examPattern: {
            stages: ["Written Test", "Document Verification", "Physical Test"],
            duration: 120,
            totalMarks: 300,
            totalQuestions: 150,
            negativeMarking: true,
            negativeMarks: 0.5,
            sections: [
              { name: "General Knowledge", marks: 120, questions: 60 },
              { name: "English", marks: 60, questions: 30 },
              { name: "Mathematics", marks: 60, questions: 30 },
              { name: "Reasoning", marks: 60, questions: 30 }
            ]
          }
        },
        preparationStats: {
          totalVacancies: 60244,
          competitionRatio: "1:80",
          difficultyLevel: "medium",
          popularityScore: 95
        }
      },
      
      // BSF Constable
      {
        name: "BSF_CONSTABLE",
        displayName: "BSF Constable",
        code: "BSF_CONSTABLE",
        level: 2,
        hierarchyPath: ["POLICE", "CENTRAL_FORCES", "BSF_CONSTABLE"],
        examScope: "all-india",
        applicableStates: ["All India"],
        examDetails: {
          frequency: "yearly",
          eligibility: { ageMin: 18, ageMax: 23, education: ["10th"] },
          examPattern: {
            stages: ["Written Test", "Physical Test", "Medical Test"],
            duration: 180,
            totalMarks: 200,
            totalQuestions: 100,
            sections: [
              { name: "General Knowledge", marks: 50, questions: 25 },
              { name: "Mathematics", marks: 50, questions: 25 },
              { name: "English", marks: 50, questions: 25 },
              { name: "Reasoning", marks: 50, questions: 25 }
            ]
          }
        },
        preparationStats: {
          totalVacancies: 35000,
          competitionRatio: "1:50",
          difficultyLevel: "medium",
          popularityScore: 85
        }
      }
    ]
  },

  // 2. ARMY CATEGORY
  army: {
    level0: {
      name: "ARMY",
      displayName: "Army & Defence",
      code: "ARMY",
      level: 0,
      hierarchyPath: ["ARMY"],
      icon: "🪖",
      color: "#059669",
      description: "Indian Army recruitment - Officer and Soldier level",
      preparationStats: {
        studentsPreparingCount: 200000,
        popularityScore: 88,
        difficultyLevel: "hard"
      }
    },
    level1: [
      {
        name: "OFFICER_ENTRY",
        displayName: "Officer Entry",
        code: "OFFICER_ENTRY",
        level: 1,
        hierarchyPath: ["ARMY", "OFFICER_ENTRY"],
        description: "Commissioned Officer entries - NDA, CDS, AFCAT"
      },
      {
        name: "SOLDIER_ENTRY", 
        displayName: "Soldier Entry",
        code: "SOLDIER_ENTRY",
        level: 1,
        hierarchyPath: ["ARMY", "SOLDIER_ENTRY"],
        description: "Soldier level entries - GD, Technical, Tradesman"
      }
    ],
    level2: [
      {
        name: "NDA",
        displayName: "National Defence Academy",
        code: "NDA",
        level: 2,
        hierarchyPath: ["ARMY", "OFFICER_ENTRY", "NDA"],
        examScope: "all-india",
        applicableStates: ["All India"],
        examDetails: {
          frequency: "bi-yearly",
          eligibility: { ageMin: 16, ageMax: 19, education: ["12th"] },
          examPattern: {
            stages: ["Written Test", "SSB Interview", "Medical Test"],
            duration: 300,
            totalMarks: 900,
            totalQuestions: 270,
            sections: [
              { name: "Mathematics", marks: 300, questions: 120 },
              { name: "General Ability Test", marks: 600, questions: 150 }
            ]
          },
          syllabus: {
            subjects: ["Mathematics", "English", "Physics", "Chemistry", "General Knowledge"],
            detailedSyllabus: [
              {
                subject: "Mathematics",
                topics: ["Algebra", "Trigonometry", "Calculus", "Statistics", "Probability"],
                weightage: 33,
                difficulty: "hard"
              },
              {
                subject: "General Ability Test",
                topics: ["English", "Physics", "Chemistry", "General Science", "History", "Geography"],
                weightage: 67,
                difficulty: "medium"
              }
            ]
          }
        },
        preparationStats: {
          totalVacancies: 400,
          competitionRatio: "1:15",
          difficultyLevel: "very-hard",
          averagePreparationTime: 12,
          popularityScore: 95
        }
      }
    ]
  },

  // 3. BANKING CATEGORY
  banking: {
    level0: {
      name: "BANKING",
      displayName: "Banking & Financial Services",
      code: "BANKING",
      level: 0,
      hierarchyPath: ["BANKING"],
      icon: "🏦", 
      color: "#3B82F6",
      description: "Banking sector recruitment - IBPS, SBI, RBI",
      preparationStats: {
        studentsPreparingCount: 800000,
        popularityScore: 92,
        difficultyLevel: "hard"
      }
    },
    level1: [
      {
        name: "IBPS",
        displayName: "IBPS Exams",
        code: "IBPS",
        level: 1,
        hierarchyPath: ["BANKING", "IBPS"],
        description: "Institute of Banking Personnel Selection"
      },
      {
        name: "SBI", 
        displayName: "State Bank of India",
        code: "SBI",
        level: 1,
        hierarchyPath: ["BANKING", "SBI"],
        description: "State Bank of India recruitment"
      }
    ],
    level2: [
      {
        name: "IBPS_PO",
        displayName: "IBPS PO",
        code: "IBPS_PO",
        level: 2,
        hierarchyPath: ["BANKING", "IBPS", "IBPS_PO"],
        examScope: "all-india",
        applicableStates: ["All India"],
        examDetails: {
          frequency: "yearly",
          eligibility: { ageMin: 20, ageMax: 30, education: ["graduation"] },
          examPattern: {
            stages: ["Prelims", "Mains", "Interview"],
            duration: 180,
            totalMarks: 100,
            totalQuestions: 100,
            sections: [
              { name: "English Language", marks: 30, questions: 30 },
              { name: "Quantitative Aptitude", marks: 35, questions: 35 },
              { name: "Reasoning Ability", marks: 35, questions: 35 }
            ]
          }
        },
        preparationStats: {
          totalVacancies: 4000,
          competitionRatio: "1:200",
          difficultyLevel: "hard",
          popularityScore: 95
        }
      }
    ]
  },

  // 4. SSC CATEGORY
  ssc: {
    level0: {
      name: "SSC",
      displayName: "Staff Selection Commission",
      code: "SSC",
      level: 0,
      hierarchyPath: ["SSC"],
      icon: "📊",
      color: "#8B5CF6",
      description: "Central government job recruitment",
      preparationStats: {
        studentsPreparingCount: 1200000,
        popularityScore: 98,
        difficultyLevel: "medium"
      }
    },
    level1: [
      {
        name: "SSC_CGL",
        displayName: "Combined Graduate Level",
        code: "SSC_CGL",
        level: 1,
        hierarchyPath: ["SSC", "SSC_CGL"],
        description: "Graduate level central government posts"
      },
      {
        name: "SSC_CHSL",
        displayName: "Combined Higher Secondary Level", 
        code: "SSC_CHSL",
        level: 1,
        hierarchyPath: ["SSC", "SSC_CHSL"],
        description: "12th level central government posts"
      }
    ]
  },

  // 5. TEACHING CATEGORY  
  teaching: {
    level0: {
      name: "TEACHING",
      displayName: "Teaching & Education",
      code: "TEACHING", 
      level: 0,
      hierarchyPath: ["TEACHING"],
      icon: "👩‍🏫",
      color: "#F59E0B",
      description: "Teaching job recruitment - CTET, KVS, State TET",
      preparationStats: {
        studentsPreparingCount: 600000,
        popularityScore: 85,
        difficultyLevel: "medium"
      }
    }
  },

  // 6. RAILWAY CATEGORY
  railway: {
    level0: {
      name: "RAILWAY", 
      displayName: "Indian Railways",
      code: "RAILWAY",
      level: 0,
      hierarchyPath: ["RAILWAY"],
      icon: "🚂",
      color: "#EF4444",
      description: "Railway recruitment - NTPC, ALP, Group D",
      preparationStats: {
        studentsPreparingCount: 900000,
        popularityScore: 90,
        difficultyLevel: "medium"
      }
    }
  },

  // 7. DEFENCE CATEGORY
  defence: {
    level0: {
      name: "DEFENCE",
      displayName: "Defence Forces",
      code: "DEFENCE",
      level: 0, 
      hierarchyPath: ["DEFENCE"],
      icon: "🎖️",
      color: "#10B981",
      description: "Defence recruitment - Navy, Air Force, Paramilitary",
      preparationStats: {
        studentsPreparingCount: 300000,
        popularityScore: 80,
        difficultyLevel: "hard"
      }
    }
  }
};

// Population function (without DB connection)
const populateExamData = async () => {
  try {
    console.log('🚀 Starting PrepSense.ai MVP exam data population...');
    
    // Clear existing data
    await ExamHierarchy.deleteMany({});
    console.log('🗑️ Cleared existing exam data');

    // Track created documents for parent-child relationships
    const createdDocs = {};
    
    // Step 1: Create Level 0 (Main Categories)
    console.log('📂 Creating main categories (Level 0)...');
    for (const [key, categoryData] of Object.entries(mvpExamData)) {
      const level0Doc = await ExamHierarchy.create(categoryData.level0);
      createdDocs[categoryData.level0.code] = level0Doc._id;
      console.log(`✅ Created: ${categoryData.level0.displayName}`);
    }

    // Step 2: Create Level 1 (Sub Categories)  
    console.log('📁 Creating sub-categories (Level 1)...');
    for (const [key, categoryData] of Object.entries(mvpExamData)) {
      if (categoryData.level1) {
        for (const subCat of categoryData.level1) {
          subCat.parentId = createdDocs[categoryData.level0.code];
          const level1Doc = await ExamHierarchy.create(subCat);
          createdDocs[subCat.code] = level1Doc._id;
          console.log(`✅ Created: ${subCat.displayName}`);
        }
      }
    }

    // Step 3: Create Level 2 (Specific Exams)
    console.log('📄 Creating specific exams (Level 2)...');
    for (const [key, categoryData] of Object.entries(mvpExamData)) {
      if (categoryData.level2) {
        for (const exam of categoryData.level2) {
          // Find parent ID based on hierarchy
          const parentCode = exam.hierarchyPath[exam.hierarchyPath.length - 2];
          if (createdDocs[parentCode]) {
            exam.parentId = createdDocs[parentCode];
          } else {
            exam.parentId = createdDocs[categoryData.level0.code];
          }
          
          await ExamHierarchy.create(exam);
          console.log(`✅ Created: ${exam.displayName}`);
        }
      }
    }

    console.log('\n🎉 PrepSense.ai MVP exam data populated successfully!');
    console.log('\n📊 Summary:');
    
    const counts = await Promise.all([
      ExamHierarchy.countDocuments({ level: 0 }),
      ExamHierarchy.countDocuments({ level: 1 }),
      ExamHierarchy.countDocuments({ level: 2 })
    ]);
    
    console.log(`📂 Main Categories: ${counts[0]}`);
    console.log(`📁 Sub Categories: ${counts[1]}`);  
    console.log(`📄 Specific Exams: ${counts[2]}`);
    console.log(`📈 Total Exams: ${counts[0] + counts[1] + counts[2]}`);

    return {
      success: true,
      message: 'Exam data populated successfully',
      counts: {
        mainCategories: counts[0],
        subCategories: counts[1],
        specificExams: counts[2],
        total: counts[0] + counts[1] + counts[2]
      }
    };
    
  } catch (error) {
    console.error('❌ Error populating data:', error);
    throw error;
  }
};

module.exports = { 
  populateExamData, 
  mvpExamData 
};
