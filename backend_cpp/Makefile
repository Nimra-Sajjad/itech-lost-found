CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -I.

SRCS = Implementations.cpp main.cpp
OBJS = $(SRCS:.cpp=.o)
TARGET = itech_lostfound_engine

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET) itech_lostfound_backup.json

run: $(TARGET)
	./$(TARGET)
