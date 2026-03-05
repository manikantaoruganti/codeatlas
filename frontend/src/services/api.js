// import axios from 'axios';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// export const API = `${BACKEND_URL}/api`;

// const api = axios.create({
//   baseURL: API,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const analysisService = {
//   analyzeCode: async (projectName, fileContent, fileName) => {
//     const response = await api.post('/analyze', {
//       project_name: projectName,
//       file_content: fileContent,
//       file_name: fileName,
//     });
//     return response.data;
//   },

//   analyzeMultiple: async (projectName, files) => {
//     const response = await api.post('/analyze', {
//       project_name: projectName,
//       files: files,
//     });
//     return response.data;
//   },

//   analyzeUpload: async (file, projectName) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('project_name', projectName);

//     const response = await api.post('/analyze/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   },

//   getAnalyses: async (limit = 10) => {
//     const response = await api.get(`/analyses?limit=${limit}`);
//     return response.data;
//   },

//   getAnalysis: async (id) => {
//     const response = await api.get(`/analyses/${id}`);
//     return response.data;
//   },
// };

// export const compilerService = {
//   executeCode: async (language, code, inputData = '') => {
//     const response = await api.post('/compile', {
//       language,
//       code,
//       input_data: inputData,
//     });
//     return response.data;
//   },
// };

// export const aiService = {
//   getInsights: async (analysisId, intent = 'maintainability') => {
//     const response = await api.post('/ai-insights', {
//       analysis_id: analysisId,
//       intent,
//     });
//     return response.data;
//   },
// };

// export const healthCheck = async () => {
//   const response = await api.get('/health');
//   return response.data;
// };

// export default api;
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------------- ANALYSIS SERVICE (UNCHANGED) ---------------- */

export const analysisService = {
  analyzeCode: async (projectName, fileContent, fileName) => {
    const response = await api.post('/analyze', {
      project_name: projectName,
      file_content: fileContent,
      file_name: fileName,
    });
    return response.data;
  },

  analyzeMultiple: async (projectName, files) => {
    const response = await api.post('/analyze', {
      project_name: projectName,
      files: files,
    });
    return response.data;
  },

  analyzeUpload: async (file, projectName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_name', projectName);

    const response = await api.post('/analyze/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAnalyses: async (limit = 10) => {
    const response = await api.get(`/analyses?limit=${limit}`);
    return response.data;
  },

  getAnalysis: async (id) => {
    const response = await api.get(`/analyses/${id}`);
    return response.data;
  },
};

/* ---------------- COMPILER SERVICE (UPDATED TO PISTON) ---------------- */

// export const compilerService = {


//   executeCode: async (language, code, inputData = '') => {

//     const filenameMap = {
//       c: "main.c",
//       cpp: "main.cpp",
//       java: "Main.java",
//       python: "main.py",
//       javascript: "main.js",
//       typescript: "main.ts",
//       rust: "main.rs",
//       csharp: "main.cs",
//       kotlin: "main.kt",
//       go: "main.go",
//       swift: "main.swift",
//       ruby: "main.rb",
//       php: "main.php",
//       r: "main.r",
//       scala: "main.scala",
//       bash: "main.sh",
//       sql: "main.sql"
//     };

//     try {
//       const response = await axios.post(
//         "https://emkc.org/api/v2/piston/execute",
//         {
//           language,
//           version: "*",
//           files: [
//             {
//               name: filenameMap[language] || "main.txt",
//               content: code,
//             },
//           ],
//           stdin: inputData,
//         }
//       );

//       const data = response.data;

//       return {
//         success: true,
//         output: (data.run?.output || data.compile?.output || "No output").trim(),
//         execution_time: data.run?.time || 0,
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   },
// };

 

// export const compilerService = {

//   executeCode: async (language, code, inputData = '') => {

//     const languageMap = {
//       python: "python3",
//       javascript: "nodejs",
//       typescript: "nodejs",
//       cpp: "cpp17",
//       c: "c",
//       java: "java",
//       go: "go",
//       rust: "rust",
//       csharp: "csharp",
//       kotlin: "kotlin",
//       swift: "swift",
//       ruby: "ruby",
//       php: "php",
//       r: "r",
//       scala: "scala",
//       bash: "bash",
//       sql: "mysql"
//     };

//     try {

//       const response = await axios.post(
//         "https://api.jdoodle.com/v1/execute",
//         {
//           clientId: "f2e93f1e67995326ba5aa85ba7890c59",
//           clientSecret:  "28f14dccdaa8eabc39f803d5167a60c66e4dc8a237e29f984d74af0de54eeb21",
//           script: code,
//           stdin: inputData,
//           language: languageMap[language] || language,
//           versionIndex: "0"
//         }
//       ); 

//       const data = response.data;

//       return {
//         success: true,
//         output: (data.output || "No output").trim(),
//         execution_time: data.cpuTime || 0
//       };

//     } catch (error) {

//       return {
//         success: false,
//         error: error.message
//       };

//     }

//   }

// };
export const compilerService = {

  executeCode: async (language, code, inputData = '') => {

    try {

      const response = await api.post('/compile', {
        language,
        code,
        input_data: inputData
      });

      return response.data;

    } catch (error) {

      return {
        success: false,
        error: error.message
      };

    }

  }

};

/* ---------------- AI SERVICE (UNCHANGED) ---------------- */

export const aiService = {
  getInsights: async (analysisId, intent = 'maintainability') => {
    const response = await api.post('/ai-insights', {
      analysis_id: analysisId,
      intent,
    });
    return response.data;
  },
};

/* ---------------- HEALTH CHECK (UNCHANGED) ---------------- */

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
