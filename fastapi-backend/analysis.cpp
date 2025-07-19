// analysis.cpp
#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string input;
    std::getline(std::cin, input);  // Read full input from stdin

    std::istringstream iss(input);
    std::string word;
    int wordCount = 0;
    while (iss >> word) wordCount++;

    std::cout << "{ \"wordCount\": " << wordCount << " }" << std::endl;
    return 0;
}
