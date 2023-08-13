import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1> Give feedback </h1>
        <Button text="Great" handleClick={() => setGood(good + 1)} />
        <Button text="Edible" handleClick={() => setNeutral(neutral + 1)} />
        <Button text="IT'S RAW" handleClick={() => setBad(bad + 1)} />

        <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedback = good + neutral + bad;
  const average = totalFeedback !== 0 ? (good - bad) / totalFeedback : 0;
  const positivePercentage = totalFeedback !== 0 ? (good / totalFeedback) * 100 : 0;

  const renderStatistics = () => (
    <>
      <table>
        <tbody>
          <tr>
            <td><StatisticLine text="Great" /></td>
            <td>{good}</td>
          </tr>
          <tr>
            <td><StatisticLine text="Edible" /></td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td><StatisticLine text="Poor" /></td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td><StatisticLine text="Total feedback" /></td>
            <td>{totalFeedback}</td>
          </tr>
          <tr>
            <td><StatisticLine text="Average" /></td>
            <td>{average}</td>
          </tr>
          <tr>
            <td><StatisticLine text="Positive feedback" /></td>
            <td>{`${positivePercentage}%`}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
  
  /* Tämä kuului renderStatisticsiin
    <StatisticLine text="Great" value={good} />
    <StatisticLine text="Edible" value={neutral} />
    <StatisticLine text="Poor" value={bad} />
    <StatisticLine text="Total feedback" value={totalFeedback} />
    <StatisticLine text="Average" value={average} />
    <StatisticLine text="Positive feedback" value={`${positivePercentage}%`} />
  */

  return (

    <div>
      <h1>Statistics</h1>
      {totalFeedback > 0 ? renderStatistics() : <p>No feedbacks given</p>}
    </div>
  );
}

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>;
const StatisticLine = ({ text, value }) => <p>{text}: {value}</p>;


export default App