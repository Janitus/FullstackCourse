import React from 'react';

const Header = ({ courseName }) => {
  return (
    <h1>{courseName}</h1>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Course = ({ course }) => {
  const getTotalExercises = () => course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <p><b> total of {getTotalExercises()} exercises </b></p>
    </div>
  )
}

export default Course;
