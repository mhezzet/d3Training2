import React, { useState, useRef, useEffect } from "react"
import * as d3 from "d3"
// import Range from "rc-slider/lib/Range"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import Layout from "../layout/layout"
import data from "../data/coins.json"
import moment from "moment"

const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)

export default function CoinStats() {
  const svg = useRef(null)
  const [selectedCoin, setSelectedCoin] = useState(() =>
    data.bitcoin
      .filter(
        coin => coin["24h_vol"] && coin["market_cap"] && coin["price_usd"]
      )
      .map(coin => ({
        ...coin,
        "24h_vol": +coin["24h_vol"],
        market_cap: +coin.market_cap,
        price_usd: +coin.price_usd,
        date: fixDate(coin.date),
      }))
  )
  const [selectedFilter, setSelectedFilter] = useState("price_usd")
  const [range, setRange] = useState([0, 100])

  const coinChangeHandler = e => {
    setSelectedCoin(
      data[e.target.value]
        .filter(
          coin => coin["24h_vol"] && coin["market_cap"] && coin["price_usd"]
        )
        .map(coin => ({
          ...coin,
          "24h_vol": +coin["24h_vol"],
          market_cap: +coin.market_cap,
          price_usd: +coin.price_usd,
          date: fixDate(coin.date),
        }))
    )
  }
  const TimeScale = d3
    .scaleTime()
    .domain(d3.extent(selectedCoin, d => d.date))
    .range([0, 100])

  useEffect(() => {
    const newCoin = selectedCoin.filter(coin =>
      moment(coin.date).isBetween(
        TimeScale.invert(range[0]),
        TimeScale.invert(range[1])
      )
    )

    d3Render(svg, { yValue: selectedFilter, coin: newCoin })
  }, [svg.current, selectedFilter, selectedCoin, range])

  // console.log(moment(TimeScale.invert(range[0])).format("YYYY MM DD"))
  // console.log(moment(TimeScale.invert(range[1])).format("YYYY MM DD"))

  return (
    <Layout>
      <div className="flex justify-center items-center w-1/2 mt-20 mb-10">
        <span className="mr-2">Date </span>
        <Range
          className="mr-3"
          tipFormatter={value => {
            return moment(TimeScale.invert(value)).format("YYYY MM DD")
          }}
          defaultValue={range}
          max={100}
          min={0}
          onChange={value => setRange(value)}
          style={{ width: 180 }}
        />
        <select className="border mr-2" onChange={coinChangeHandler}>
          <option value="bitcoin">bitcoin</option>
          <option value="bitcoin_cash">bitcoin cash</option>
          <option value="ethereum">ethereum</option>
          <option value="litecoin">litecoin</option>
          <option value="ripple">ripple</option>
        </select>
        <select
          className="border"
          onChange={e => setSelectedFilter(e.target.value)}
        >
          <option value="price_usd">Price in dollars</option>
          <option value="market_cap">Market capitalization</option>
          <option value="24h_vol">24 Hour trading volume</option>
        </select>
      </div>
      <svg ref={svg} width="700" height="500" />
    </Layout>
  )
}

function d3Render(selection, { yValue, coin }) {
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

  let yLabelText
  switch (yValue) {
    case "price_usd":
      yLabelText = "Price in dollars"
      break
    case "market_cap":
      yLabelText = "Market capitalization"
      break
    case "24h_vol":
      yLabelText = "24 Hour trading volume"
      break
    default:
      yLabelText = "unKnow"
      break
  }
  const xLabelText = "Time"
  const titleText = "Coins Stats"

  // margin convention
  const canvasPadding = { top: 50, bottom: 50, left: 70, right: 20 }
  const canvasInnerWidth =
    canvasWidth - canvasPadding.left - canvasPadding.right
  const canvasInnerHeight =
    canvasHeight - canvasPadding.top - canvasPadding.bottom
  const graph = canvasEnter.attr(
    "transform",
    `translate(${canvasPadding.left},${canvasPadding.top})`
  )

  //scales

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(coin, d => d.date))
    .range([0, canvasInnerWidth])

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(coin, d => d[yValue]))
    .range([canvasInnerHeight, 0])
    .nice()

  //axes
  const yAxis = d3.axisLeft(yScale).tickFormat(number => {
    switch (yValue) {
      case "price_usd":
        return d3.format("$")(number)
      case "market_cap":
        return d3
          .format(".1s")(number)
          .replace("G", "B")
      case "24h_vol":
        return d3
          .format(".1s")(number)
          .replace("G", "B")
      default:
        return number
    }
  })
  const xAxis = d3.axisBottom(xScale)

  graph
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${canvasInnerHeight})`)
    .merge(canvas.select(".x-axis"))
    .transition()
    .duration(300)
    .call(xAxis)
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", "larg")

  graph
    .append("g")
    .attr("class", "y-axis")
    .merge(canvas.select(".y-axis"))
    .transition()
    .duration(300)
    .call(yAxis)
    .selectAll(".tick text")
    .style("fill", "#1d2228")
    .style("font-size", "larg")

  //line
  const lineGenerator = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d[yValue]))
    .curve(d3.curveBasis)

  graph
    .append("path")
    .attr("class", "line-graph")
    .merge(canvas.select(".line-graph"))
    .transition()
    .duration(300)
    .attr("d", lineGenerator(coin))
    .style("fill", "none")
    .style("stroke-width", 1)
    .style("stroke", "#1d2228")
    .style("stroke-linejoin", "round")
    .style("stroke-linecap", "round")

  //title
  graph
    .append("text")
    .attr("x", "40%")
    .style("font-size", "xx-large")
    .style("fill", "#1d2228")

    .text(titleText)

  //x-label
  graph
    .append("text")
    .attr("x", 288)
    .attr("y", 447)
    .style("font-size", "large")
    .style("fill", "#1d2228")

    .text(xLabelText)

  //y-label
  graph
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", "-40%")
    .attr("y", -50)
    .style("font-size", "large")
    .attr("transform", "rotate(-90)")
    .style("fill", "#1d2228")
    .merge(canvas.select(".y-axis-label"))
    .text(yLabelText)
}

function fixDate(date) {
  let temp
  const array = date.split("/")
  temp = array[0]
  array[0] = array[1]
  array[1] = temp
  const fixedDate = array.join("/")
  return new Date(fixedDate)
}
