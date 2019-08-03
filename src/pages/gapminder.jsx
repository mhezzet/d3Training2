import React, { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import Layout from "../layout/layout"
import data from "../data/countries.json"

export default function GapMinder() {
  const [index, setIndex] = useState(0)
  const svg = useRef(null)

  useEffect(() => {
    d3Render(svg, { index })
  }, [svg.current, index])

  useEffect(() => {
    setInterval(() => setIndex(i => (i !== 214 ? i + 1 : 0)), 100)
  }, [])

  return (
    <Layout>
      <svg ref={svg} width="700" height="500" />
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

  const radiusScale = d3.scaleLinear([0, maxPopulation], [5, 40])

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
  const circles = canvas.selectAll("circle").data(countries, d => d.country)

  circles.join(
    enter =>
      enter
        .append("circle")
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => radiusScale(d.population))
        .style("fill", d => colorScale(d.continent))
        .style("opacity", "0.3"),
    update =>
      update
        .transition()
        .duration(100)
        .attr("cx", d => {
          return xScale(d.income)
        })
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => radiusScale(d.population))
        .style("fill", d => colorScale(d.continent))
        .style("opacity", "0.3")
  )

  //year
  const yearText = canvas.selectAll(".year").data([null])

  yearText.join(
    enter =>
      enter
        .append("text")
        .text(`year ${year}`)
        .attr("class", "year")
        .attr("x", "60%")
        .attr("y", canvasInnerHeight - 40),

    update =>
      update
        .transition()
        .duration(100)
        .text(`year ${year}`)
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
    .attr("y", -70)
    .style("font-size", "large")
    .attr("transform", "rotate(-90)")
    .style("fill", "#1d2228")
}
