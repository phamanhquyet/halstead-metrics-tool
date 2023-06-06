# HALSTEAD METHOD TOOL

A calculation tool powered by the Halstead method, empowering you to analyze and optimize software complexity like never before.

## Live demo:

Check out demo [here](https://phamanhquyet.github.io/halstead-metrics-tool/)

## Description

### Halstead’s Work

Maurice Halstead’s Theory (1971~1979):
A program P is a collection of tokens, composed of two basic elements: operands and operators:

- Operands are variables, constants, addresses.
- Operators are defined operations in a programming language.

From there, we have the following notations:

- Number of distinct operators in the program (μ1).
- Number of distinct operands in the program (μ2).
- Total number of occurrences of operators in the program (N1).
- Total number of occurrences of operands in the program (N2).

From the collected data, we will calculate the following indicators: difficulty, volume, effort and time.

- Program vocabulary (μ):
  `μ = μ1 + μ2`
- Program length is the total number of occurrences of operators and operands:
  `N = N1 + N2`
- Program volume is the number of mental comparisons needed to write a program of length N:
  `V = N log2 μ = (N1 + N2 ) log2 (μ1 + μ2 )`
- Program length is the total number of occurrences of operators and operands:
  `N = N1 + N2`
