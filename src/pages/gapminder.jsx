import React, { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import tip from "d3-tip"
import Layout from "../layout/layout"
import data from "../data/countries.json"

export default function GapMinder() {
  const [index, setIndex] = useState(0)
  const [loop, setLoop] = useState(null)
  const svg = useRef(null)

  useEffect(() => {
    d3Render(svg, { index })
  }, [svg.current, index])

  const startInterval = () => {
    const interval = setInterval(
      () => setIndex(i => (i !== 214 ? i + 1 : 0)),
      100
    )
    setLoop(interval)
  }

  const stopInterval = () => {
    clearInterval(loop)
    setLoop(null)
  }

  useEffect(() => {
    startInterval()
  }, [])

  return (
    <Layout>
      <svg ref={svg} width="700" height="500" />
      <div className="flex justify-between items-center">
        <button
          className="customButton"
          onClick={() => (loop ? stopInterval() : startInterval())}
        >
          {loop ? "stop" : "start"}
        </button>
        <button className="customButton" onClick={() => setIndex(0)}>
          reset
        </button>
        <label style={{ marginLeft: 7 }} htmlFor="range">
          year
        </label>
        <input
          style={{ marginLeft: 7 }}
          id="range"
          onChange={e => setIndex(+e.target.value)}
          value={index}
          type="range"
          min="0"
          max="213"
        />
      </div>
    </Layout>
  )
}

function d3Render(selection, { index }) {
  if (!selection.current) return

  const svg = d3.select(selection.current)
  const canvas = d3
    .select(selection.current)
    .selectAll(".all")
    .data([null])

  const canvasEnter = canvas
    .enter()
    .append("g")
    .attr("class", "all")

  const canvasWidth = svg.attr("width")
  const canvasHeight = svg.attr("height")

  const yLabelText = "Life Expectancy (years)"
  const xLabelText = "GDP Per Capita ($)"
  const titleText = "Countries GDP throw Time"

  // margin convention
  const canvasPadding = { top: 150, bottom: 100, left: 150, right: 10 }
  const canvasInnerWidth =
    canvasWidth - canvasPadding.left - canvasPadding.right
  const canvasInnerHeight =
    canvasHeight - canvasPadding.top - canvasPadding.bottom
  const graph = canvasEnter.attr(
    "transform",
    `translate(${canvasPadding.left},${canvasPadding.top})`
  )

  //data
  const year = data[index].year
  const countries = data[index].countries.filter(
    country => country.income && country.life_exp
  )

  //tooltip
  const tipper = tip()
    .attr("class", "d3-tip")
    .html(
      d => `
            <strong>Country:</strong> <span style='color:tomato'>
            ${d.country}</span><br/>
            <strong>Continent:</strong> <span style='color:tomato'>
            ${d.continent}</span><br/>
            <strong>Life Expectancy:</strong> <span style='color:tomato'>
            ${d.life_exp}</span><br/>
            <strong>GDP Per Capita:</strong> <span style='color:tomato'>
            ${d3.format("$,.0f")(d.income)}</span><br/>
            <strong>Population:</strong> <span style='color:tomato'>
            ${d3.format(",")(d.population)}</span><br/>
            `
    )

  canvas.call(tipper)

  //scales
  const xScale = d3
    .scaleLog()
    .base(10)
    .range([0, canvasInnerWidth])
    .domain([142, maxGDP])

  const yScale = d3
    .scaleLinear()
    .domain([0, maxExpYear])
    .range([canvasInnerHeight, 0])

  const colorScale = d3
    .scaleOrdinal()
    .domain(continents)
    .range(d3.schemeSpectral[4])

  const radiusScale = d3.scaleLinear([0, maxPopulation], [5, 45])

  //axes
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"))

  const yAxis = d3.axisLeft(yScale)
  graph
    .append("g")
    .call(xAxis)
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${canvasInnerHeight})`)
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", "larg")

  graph
    .append("g")
    .call(yAxis)
    .attr("class", "y-axis")
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", "larg")

  //circles
  const circles = canvas.selectAll(".circler").data(countries, d => d.country)

  circles.join(
    enter =>
      enter
        .append("circle")
        .attr("class", "circler")
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => radiusScale(d.population))
        .style("fill", d => colorScale(d.continent))
        .style("opacity", "0.3")
        .on("mouseover", tipper.show)
        .on("mouseout", tipper.hide),
    update =>
      update
        .transition()
        .duration(100)
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => radiusScale(d.population))
        .style("fill", d => colorScale(d.continent))
        .style("opacity", "0.3")
  )

  //color legend
  const legendsContainer = canvas
    .selectAll(".legends")
    .data([null])
    .enter()
    .append("g")
    .attr("class", "legends")
    .attr("transform", "translate(430,120)")

  const legends = legendsContainer.selectAll(".legend").data(continents)
  legends.exit().remove()

  const legendEnter = legends
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (_, i) => `translate(0,${i * 20})`)

  legendEnter
    .append("circle")
    .merge(legends.selectAll("circle"))
    .attr("r", 5)
    .attr("fill", colorScale)
  legendEnter
    .append("text")
    .merge(legends.selectAll("text"))
    .attr("dy", "0.32em")
    .text(d => d)
    .attr("x", 15)

  //year
  const yearText = canvas.selectAll(".year").data([null])

  yearText.join(
    enter =>
      enter
        .append("text")
        .text(`year ${year}`)
        .attr("class", "year")
        .attr("x", "60%")
        .attr("y", canvasInnerHeight - 10)
        .style("font-size", "x-large"),

    update => update.text(`year ${year}`)
  )

  //title
  graph
    .append("text")
    .text(titleText)
    .attr("x", "10%")
    .style("font-size", "xx-large")
    .style("fill", "#1d2228")

  //x-label
  graph
    .append("text")
    .text(xLabelText)
    .attr("x", 200)
    .attr("y", canvasHeight / 2 + 40)
    .style("font-size", "large")
    .style("fill", "#1d2228")

  //y-label
  graph
    .append("text")
    .text(yLabelText)
    .attr("x", -200)
    .attr("y", -40)
    .style("font-size", "large")
    .attr("transform", "rotate(-90)")
    .style("fill", "#1d2228")
}

//data
const maxExpYear = data.reduce((maxExp, current) => {
  const max = current.countries
    .filter(country => country.income && country.life_exp)
    .reduce(
      (smallMax, country) =>
        country.life_exp > smallMax ? country.life_exp : smallMax,
      0
    )

  return max > maxExp ? max : maxExp
}, 0)

const maxGDP = data.reduce((maxExp, current) => {
  const max = current.countries
    .filter(country => country.income && country.life_exp)
    .reduce(
      (smallMax, country) =>
        country.income > smallMax ? country.income : smallMax,
      0
    )

  return max > maxExp ? max : maxExp
}, 0)

const maxPopulation = data.reduce((maxExp, current) => {
  const max = current.countries
    .filter(country => country.income && country.life_exp)
    .reduce(
      (smallMax, country) =>
        country.population > smallMax ? country.population : smallMax,
      0
    )

  return max > maxExp ? max : maxExp
}, 0)

const continents = data[0].countries.reduce(
  (continents, country) =>
    continents.includes(country.continent)
      ? continents
      : [...continents, country.continent],
  []
)
