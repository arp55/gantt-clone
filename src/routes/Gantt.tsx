import {
  Typography,
  TextField,
  Button,
  MenuItem,
  // useMediaQuery,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./Gantt.scss";
import CustomInput from "../components/GanttInput";
import { GanttData, ScheduleTypes, gantData } from "../utils/data";

const buffer = 15;
const cellHeight = 90;
const barHeight = 12;
const cellWidth = 74;

const barColors: Record<ScheduleTypes, string> = {
  scheduled: "#e7e21f",
  ongoing: "#14bc2b",
  completed: "#1f6afd",
  delayed: "#e60f0f",
};

const viewParam: any = {
  month: "M",
  week: "w",
};

const formatTypes: any = {
  month: "MMM YY",
  week: "DD MMM",
};

const views = ["month", "week"];

export default function Gantt() {
  const [date, setDate] = useState(new Date());
  const [intervals, setIntervals] = useState<any[]>([]);
  const [openPicker, setOpenPicker] = useState<any>(false);
  const [left, setLeft] = useState<any>(null);
  const [scroll, setScroll] = useState<boolean>(false);

  const [boxHeight, setBoxHeight] = useState<number>(100);

  // const [selectedDate, setSelectedDate] = useState(new Date());

  const [view, setView] = useState("month");

  const divRefs = useRef<any>([]);
  const itemsRef = useRef<any>([]);
  const boxRef = useRef<any>([]);
  const leftBoxRef = useRef<any>();

  // const responsive = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    // dates calculation
    const start = moment(date).subtract(buffer, viewParam[view]);
    // const end = moment(selectedDate).add(buffer, viewParam[view]);
    const allMonths: any[] = [];
    for (let i = 0; i < buffer * 2; i++) {
      if (view === "week") {
        const intString = `${moment(start)
          .add(i, viewParam[view])
          .startOf("w")
          .format(formatTypes[view])}-${moment(start)
          .add(i, viewParam[view])
          .endOf("w")
          .format(formatTypes[view])}`;
        allMonths.push(intString);
      } else
        allMonths.push(
          moment(start).add(i, viewParam[view]).format(formatTypes[view]),
        );
    }
    setIntervals(allMonths);
  }, [date, view]);

  useEffect(() => {
    let allVals: any = {};
    divRefs.current.forEach((refs: any, index: number) => {
      allVals = { ...allVals, [intervals[index]]: refs.offsetLeft };
    });
    setLeft(allVals);
  }, [divRefs, intervals]);

  // useEffect(() => {
  //     let allVals: any = {}
  //     itemsRef.current.forEach((refs: any, index: number) => {
  //         allVals = { ...allVals, [policyNames[index]]: refs.offsetTop + (cellHeight / 2) }
  //     })
  //     setTops(allVals)
  // }, [itemsRef.current])

  function rec() {
    setScroll(!scroll);
  }
  function handlePicker(date: any) {
    setDate(date.toDate());
  }

  function onClick() {
    const sWidth = boxRef?.current?.scrollWidth;
    const { width: boxWidth } = boxRef?.current?.getBoundingClientRect();
    boxRef.current.scrollTo({
      left: (sWidth - boxWidth + cellWidth) / 2,
      top: 0,
      behavior: "smooth",
    });
  }

  const handleChange = (event: any) => {
    const newView = event.target.value;

    setView(newView as string);
  };

  // useEffect(() => {
  //   if (!isClicked) {
  //     const sWidth = boxRef?.current?.scrollWidth;
  //     const { width: boxWidth } = boxRef?.current?.getBoundingClientRect();
  //     boxRef.current.scrollTo({
  //       left: (sWidth - boxWidth + cellWidth) / 2,
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [selectedDate, events, isClicked]);

  useEffect(() => {
    const bCurrent = boxRef.current;
    const observer = new ResizeObserver((entries) => {
      const sWidth = boxRef?.current?.scrollWidth;
      const { width: boxWidth } = entries[0].contentRect;
      bCurrent.scrollTo({
        left: (sWidth - boxWidth + cellWidth) / 2,
        top: 0,
        behavior: "smooth",
      });
    });
    observer.observe(bCurrent);
    return () => {
      bCurrent && observer.unobserve(bCurrent);
    };
  }, []);

  useEffect(() => {
    const { height } = leftBoxRef?.current?.getBoundingClientRect();
    setBoxHeight(height - 42);
  }, [leftBoxRef]);

  function getStyle(isCurrent: boolean) {
    let color = "#fff";
    if (isCurrent) {
      color = "#f0f8ff";
    } else {
      color = "#fff";
    }
    return color;
  }

  return (
    <div className="view-container">
      <div className="topbar-flex">
        <Typography className="task-text">{gantData.length} Tasks</Typography>
      </div>
      <div className="calendar-topbar-container">
        <div className="calendar-topbar-wrapper">
          <div style={{ display: "flex", alignItems: "center", flex: ".47" }}>
            <Button
              variant="contained"
              className="calendar-today-box"
              style={{
                borderColor: "#DBE2F0",
              }}
              onClick={onClick}
            >
              <Typography className="calendar-today-box-text">Today</Typography>
            </Button>
            <DatePicker
              open={openPicker}
              openTo="year"
              views={["year", "month"]}
              value={date}
              onChange={handlePicker}
              className="year-picker"
              onOpen={() => setOpenPicker(true)}
              onClose={() => setOpenPicker(false)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={
                    view === "day"
                      ? moment(date).format("DD MMMM YYYY")
                      : moment(date).format("MMMM YYYY")
                  }
                  onClick={() => setOpenPicker(true)}
                  // disabled
                  fullWidth
                  variant="standard"
                  inputProps={{ className: "month-picker" }}
                  // onFocus={(event) => {
                  //   event.target.select();
                  // }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <ArrowDropDownIcon style={{ color: "#8994A9" }} />
                    ),
                    disableUnderline: true,
                    style: { paddingRight: 0, borderColor: "#DBE2F0" },
                  }}
                />
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: ".5",
              justifyContent: "flex-end",
            }}
          >
            <CustomInput
              name="View"
              value={view}
              fullWidth={false}
              onChange={handleChange}
              select
              themeType={{
                borderDark: "#4F5769",
                bgDark: null,
              }}
              style={{ padding: "1px 1.2%" }}
              InputProps={{
                classes: {
                  input: "select-item",
                },
              }}
              inputProps={{
                classes: {
                  icon: "select-icon",
                },
              }}
            >
              {views.map((view: any) => (
                <MenuItem style={{ textTransform: "capitalize" }} value={view}>
                  {view}
                </MenuItem>
              ))}
            </CustomInput>
          </div>
        </div>
      </div>
      <div
        className="gantt-container gantt-light"
        style={{
          height: "500px",
        }}
      >
        <div className="left-box" ref={leftBoxRef} onScroll={() => rec()}>
          <div className="top-header">
            <Typography className="top-header-text">Tasks</Typography>
          </div>
          {gantData?.map((data: any, index: number) => {
            return (
              <div
                className="policy-name"
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <Typography className="policy-name-text">
                  {data.task_name}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className="right-box position-relative" ref={boxRef}>
          <div className="top-date-box">
            {intervals?.map((interval: string, index: number) => {
              const isCurrent = interval === moment(date).format("MMM YY");

              return (
                <div
                  className="interval-box"
                  style={{ background: getStyle(isCurrent) }}
                  ref={(el) => (divRefs.current[index] = el)}
                >
                  <Typography className="interval-text">{interval}</Typography>
                </div>
              );
            })}
          </div>
          <div className="months-row" style={{ height: boxHeight }}>
            {intervals.map((interval: string) => {
              const isCurrent = interval === moment(date).format("MMM YY");
              return (
                <div
                  className="gant-row"
                  style={{
                    background: getStyle(isCurrent),
                  }}
                >
                  <div className="gant-bar" />
                </div>
              );
            })}
          </div>
          {left &&
            gantData.map((item: GanttData, index: number) => {
              // calculation of bar start
              const start =
                view === "month"
                  ? moment(item.start).format("MMM YY")
                  : `${moment(item.start)
                      .startOf("w")
                      .format("DD MMM")}-${moment(item.start)
                      .endOf("w")
                      .format("DD MMM")}`;
              const startDay =
                view === "month"
                  ? Number(moment(item.start).format("DD"))
                  : Number(moment(item.start).day());
              const startMonthTotalDays =
                view === "month" ? moment(item.start).daysInMonth() : 7;
              const leftVal = left[start];
              const leftPerDayPercent = (startDay / startMonthTotalDays) * 100;
              const leftPerDay = (leftPerDayPercent * cellWidth) / 100;
              const finalLeft = leftPerDay + leftVal;
              //calculation of bar end
              const end =
                view === "month"
                  ? moment(item.end).format("MMM YY")
                  : `${moment(item.end).startOf("w").format("DD MMM")}-${moment(
                      item.end,
                    )
                      .endOf("w")
                      .format("DD MMM")}`;
              const endDay =
                view === "month"
                  ? Number(moment(item.end).format("DD"))
                  : Number(moment(item.end).day());
              const endMonthTotalDays =
                view === "month" ? moment(item.end).daysInMonth() : 7;
              const endVal = left[end];
              const rightPerDayPercent = (endDay / endMonthTotalDays) * 100;
              const rightPerDay = (rightPerDayPercent * cellWidth) / 100;
              const finalRight = Math.min(
                rightPerDay + endVal,
                left[intervals[intervals.length - 1]] + cellWidth,
              );
              const width = finalRight - finalLeft;
              let top =
                itemsRef.current[index]?.getBoundingClientRect()?.top -
                cellHeight / 2 +
                barHeight / 2;
              // if (responsive) {
              //   top =
              //     itemsRef.current[index]?.getBoundingClientRect()?.top -
              //     cellHeight * 2 +
              //     barHeight;
              // }

              const tipText = `${item.task_name}\nStart: ${item.start}\nEnd: ${item.end}\nStatus: ${item.schedule_type}`;

              return (
                <Tooltip title={tipText}>
                  <div
                    className="gant-bar"
                    style={{
                      left: finalLeft,
                      width,
                      top,
                      background: barColors[item.schedule_type],
                    }}
                    //   onClick={() => handleRightPanel(item)}
                  />
                </Tooltip>
              );
            })}
        </div>
      </div>
    </div>
  );
}
