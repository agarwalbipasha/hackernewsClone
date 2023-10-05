require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const port = process.env.PORT;
const newStoriesUrl =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
const eachIDUrl = "https://hacker-news.firebaseio.com/v0/item/";
const newsUrl =
  "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";
const topStoriesUrl =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const showStories =
  "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty";
const maxItemUrl =
  "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty";
const askStoriesUrl =
  " https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty";
const jobStoriesUrl =
  " https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/styles", express.static(path.join(__dirname, "/styles")));
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use("/htmlFiles", express.static(path.join(__dirname, "/htmlFiles")));

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

const getEachElement = async (url) => {
  const data = await fetchData(url);
  // console.log(data);
  let el = Object.values(data.map((e) => Number(e)));
  const eachElement = await Promise.all(
    el.map(async (e) => {
      const result = await fetchData(`${eachIDUrl}${e}.json?print=pretty`);
      // result = result.map(data => {
      //   data.time = new Date(data.time).toLocaleDateString('en-en-GB');
      // })
      // console.log(result);
      return result;
    })
  );
  return eachElement;
};

const itemsToDisplay = (array) => {
  let min = 0;
  let max = 30;
  return (result = array.slice(min, max));
};

const getDate = () => {
  let today = new Date(Date.now()).toLocaleDateString("en-GB");
  let date = today.slice(0, 2);
  let yesterday, finalDate;
  if (date == 1) {
    yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    finalDate = `${yesterday.getFullYear()}-0${
      yesterday.getMonth() + 1
    }-${yesterday.getDate()}`;
  } else {
    finalDate = `${today.getFullYear()}-0${today.getMonth() + 1}-${date}`;
  }
  return finalDate;
};

const getDateInString = (date) => {
  let arrayOfMonths = [
    "Janaury",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = date.slice(5, 7);
  let index = Number(month.slice(1)) - 1;
  let monthInString = arrayOfMonths[index];
  let result = `${monthInString} ${date.slice(8)}, ${date.slice(0, 4)}`;
  return result;
};

app.get("/news", async (req, res) => {
  try {
    const eachElement = await getEachElement(newsUrl);
    const result = itemsToDisplay(eachElement);
    res.render("beststories", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/", async (req, res) => {
  try {
    const eachElement = await getEachElement(topStoriesUrl);
    const result = itemsToDisplay(eachElement);
    res.render("topStories", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/newest", async (req, res) => {
  try {
    const eachElement = await getEachElement(newStoriesUrl);
    const result = itemsToDisplay(eachElement);
    res.render("newest", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/newcomments", async (req, res) => {
  try {
    const eachElement = await getEachElement(newStoriesUrl);
    const result = itemsToDisplay(eachElement);
    res.render("newest", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/show", async (req, res) => {
  try {
    const eachElement = await getEachElement(showStories);
    const result = itemsToDisplay(eachElement);
    res.render("show", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/ask", async (req, res) => {
  try {
    const eachElement = await getEachElement(askStoriesUrl);
    const result = itemsToDisplay(eachElement);
    res.render("ask", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const eachElement = await getEachElement(jobStoriesUrl);
    const result = itemsToDisplay(eachElement);
    res.render("jobs", { result });
  } catch (error) {
    console.error(error);
  }
});

app.get("/item/:id", async (req, res) => {
  try {
    // const id = 1524184
    const url = `https://hacker-news.firebaseio.com/v0/item/${req.params.id}.json?print=pretty`;
    const element = await fetchData(url);
    console.log(element);
    res.render("item", { element });
  } catch (error) {
    console.error(error);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    // const id = 1524184
    const url = `https://hacker-news.firebaseio.com/v0/user/${req.params.id}.json?print=pretty`;
    const element = await fetchData(url);
    console.log(element);
    res.render("user", { element });
  } catch (error) {
    console.error(error);
  }
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.get("/showhn.html", (req, res) => {
  res.sendFile("views/htmlFiles/showhn.html", { root: __dirname});
});

app.get("/guidelines.html", (req, res) => {
  res.sendFile("views/htmlFiles/guidelines.html", { root: __dirname});
});

app.get("/faq.html", (req, res) => {
  res.sendFile("views/htmlFiles/faq.html", { root: __dirname});
});

app.get("/lists", (req, res) => {
  res.render("lists");
});

app.get("/security.html", (req, res) => {
  res.sendFile("views/htmlFiles/security.html", { root: __dirname});
});

app.get("/past", async (req, res) => {
  try {
    const maxID = await fetchData(maxItemUrl);
    const date = getDate();
    // console.log(date);
    const dateInString = getDateInString(date);
    // console.log(dateInString);
    let arrayOfElements = [];
    // for (let id = 1; id <= maxID; id++) {
    //   const getByID = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    //   let element = await fetchData(getByID);
    //   let elementDate = new Date(element.time).toLocaleDateString('en-GB')
    //   console.log(id, elementDate);
    //   if (elementDate == date.split('-').join('/')) {
    //     console.log(here);
    //     arrayOfElements.push(element);
    //   }
    // console.log(arrayOfElements);
    // }
    const result = await itemsToDisplay(arrayOfElements);
    console.log("result is: ", result);
    res.render("past", { date, dateInString });
  } catch (error) {
    console.error(error);
  }
  // res.render('past');
});

app.listen(port, () => {
  console.log("Server started");
});
// views/showhn.html
