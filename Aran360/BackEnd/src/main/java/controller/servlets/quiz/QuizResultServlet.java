package controller.servlets.quiz;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.helper.JSONResponse;
import service.utils.manager.CSRFService;
import service.utils.manager.DBService;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONObject;

@WebServlet("/quiz-results")
public class QuizResultServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public static int getResult(Map<Integer, String> answers) throws SQLException {
        Connection con = DBService.getConnection();
        int score = 0;
        
        String query1 = "SELECT correct_index FROM quiz WHERE id = ?";
        String query2 = "SELECT option_text FROM quiz_options WHERE quiz_id = ? AND option_order = ?";
        
        try (PreparedStatement ps1 = con.prepareStatement(query1);
             PreparedStatement ps2 = con.prepareStatement(query2)) {
            
            for (Entry<Integer, String> entry : answers.entrySet()) {
                int quizId = entry.getKey();
                String userAnswer = entry.getValue();
                
                // System.out.println("===========================================");
                // System.out.println("Processing Quiz ID: " + quizId);
                // System.out.println("User Answer: '" + userAnswer + "'");
                
                ps1.setInt(1, quizId);
                ResultSet rs1 = ps1.executeQuery();
                
                if (rs1.next()) {
                    int correctIndex = rs1.getInt("correct_index");
                    System.out.println("Correct Index: " + correctIndex);
                    
                    ps2.setInt(1, quizId);
                    ps2.setInt(2, correctIndex);
                    ResultSet rs2 = ps2.executeQuery();
                    
                    if (rs2.next()) {
                        String correctOption = rs2.getString("option_text");
                        System.out.println("Correct Option: '" + correctOption + "'");
                        
                        String trimmedUserAnswer = userAnswer.trim();
                        String trimmedCorrectOption = correctOption.trim();
                        
                        // System.out.println("Comparing (trimmed):");
                        // System.out.println("  User: '" + trimmedUserAnswer + "'");
                        // System.out.println("  Correct: '" + trimmedCorrectOption + "'");
                        
                        if (trimmedCorrectOption.equals(trimmedUserAnswer))// {
                            score++;
                            // System.out.println("✓ CORRECT! Current Score: " + score);
                        //} else {
                        //     System.out.println("✗ INCORRECT");
                        //     System.out.println("  Length comparison: user=" + trimmedUserAnswer.length() + 
                        //                      ", correct=" + trimmedCorrectOption.length());
                        // }
                    } else {
                        // System.out.println("✗ ERROR: No option found for quiz_id=" + quizId + 
                                        //  ", option_order=" + correctIndex);
                    }
                    rs2.close();
                } else {
                    // System.out.println("✗ ERROR: No quiz found with id=" + quizId);
                }
                rs1.close();
            }
            
            // System.out.println("===========================================");
            // System.out.println("FINAL SCORE: " + score + "/" + answers.size());
            // System.out.println("===========================================");
            
            return score;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String csrfNew = CSRFService.setCSRFToken(request);
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        // System.out.println("Received Request Body: " + sb.toString());
        
        JSONObject body = new JSONObject(sb.toString());
        Map<Integer, String> answers = new HashMap<>();
        
        for (String key : body.keySet()) {
            if (key.equals("csrfToken")) {
                continue;
            }
            
            try {
                int quizId = Integer.parseInt(key);
                String answer = body.getString(key);
                answers.put(quizId, answer);
                // System.out.println("Parsed Answer: Quiz ID=" + quizId + ", Answer='" + answer + "'");
            } catch (NumberFormatException e) {
                // System.err.println("Invalid quiz ID format: " + key);
                continue;
            }
        }
        
        // System.out.println("Total Answers Received: " + answers.size());
        
        try {
            int result = getResult(answers);
            
            JSONObject responseData = new JSONObject();
            responseData.put("correctAnswerCount", result);
            responseData.put("totalQuestions", answers.size());
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                JSONResponse.response(
                    JSONResponse.SUCCESS, 
                    "Answers Validated", 
                    csrfNew, 
                    responseData
                ).toString()
            );
            
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                JSONResponse.response(
                    JSONResponse.ERROR, 
                    "Something went wrong, Please try again later.", 
                    csrfNew
                ).toString()
            );
        }
    }
}
