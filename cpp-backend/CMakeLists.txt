cmake_minimum_required(VERSION 3.10)
project(cpp_backend)

set(CMAKE_CXX_STANDARD 17)

add_executable(cpp_backend main.cpp)

# Add pthread (Crow needs it)
target_link_libraries(cpp_backend pthread)
