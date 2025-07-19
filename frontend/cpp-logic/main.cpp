#include <iostream>
#include <string>
#include <algorithm>

// Function to analyze sentiment based on basic keyword matching
std::string analyzeSentiment(const std::string& input) {
    std::string text = input;

    // Convert the string to lowercase for case-insensitive comparison
    std::transform(text.begin(), text.end(), text.begin(), ::tolower);

    if (text.find("good") != std::string::npos || text.find("great") != std::string::npos || text.find("happy") != std::string::npos) {
        return "positive";
    }

    if (text.find("bad") != std::string::npos || text.find("sad") != std::string::npos || text.find("terrible") != std::string::npos) {
        return "negative";
    }

    return "neutral";
}

int main() {
    std::string input;
    std::getline(std::cin, input);

    std::string sentiment = analyzeSentiment(input);
    std::cout << sentiment;

    return 0;
}
