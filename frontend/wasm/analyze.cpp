// analyze.cpp
#include <string>
#include <emscripten/bind.h>

using namespace emscripten;

// A dummy "sentiment analyzer" - just checks for certain words
std::string analyzeText(std::string text) {
  if (text.find("good") != std::string::npos) return "positive";
  if (text.find("bad") != std::string::npos) return "negative";
  return "neutral";
}

EMSCRIPTEN_BINDINGS(my_module) {
  function("analyzeText", &analyzeText);
}
