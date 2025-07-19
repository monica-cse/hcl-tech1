// cpp-backend/main.cpp

// Tell Crow to use Boost.Asio instead of standalone Asio
#define CROW_USE_BOOST
#include "crow_all.h"
#include <string>
#include <cctype>  // for std::isspace

int main() {
    // Create a simple Crow app
    crow::SimpleApp app;

    // Define the /analyze POST endpoint
    CROW_ROUTE(app, "/analyze").methods(crow::HTTPMethod::Post)(
        [](const crow::request& req) {
            // Try to parse incoming JSON from request body
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            // Extract the 'content' field from the JSON
            std::string text = body["content"].s();

            // Simple word count logic
            int wordCount = 0;
            bool inWord = false;
            for (char c : text) {
                if (std::isspace(static_cast<unsigned char>(c))) {
                    if (inWord) {
                        wordCount++;
                        inWord = false;
                    }
                } else {
                    inWord = true;
                }
            }
            if (inWord) wordCount++;  // Count last word if ends without space

            // Build JSON response
            crow::json::wvalue result;
            result["word_count"] = wordCount;

            return crow::response(result);
        }
    );

    // Start the app on port 8000 with multithreading
    app.port(8000).multithreaded().run();
}
