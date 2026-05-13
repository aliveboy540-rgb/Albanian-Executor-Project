cmake_minimum_required(VERSION 3.18)
project(albanian_executor_native LANGUAGES CXX)

add_library(albanian_executor SHARED native-lib.cpp)

find_library(log-lib log)

target_include_directories(albanian_executor PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

target_link_libraries(albanian_executor ${log-lib})

target_compile_features(albanian_executor PRIVATE cxx_std_17)
