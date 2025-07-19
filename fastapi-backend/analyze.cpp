// analyze.cpp
#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string input;
    std::getline(std::cin, input);  // Read input from stdin

    // Count the number of words
    std::istringstream stream(input);
    int wordCount = 0;
    std::string word;
    while (stream >> word) wordCount++;

    // Output simple JSON string manually
    std::cout << "{ \"word_count\": " << wordCount << " }" << std::endl;
    return 0;
}
