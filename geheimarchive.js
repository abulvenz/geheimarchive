import m from "mithril";
import tagl from "tagl-mithril";

// Define some tags
const {
  header,
  h1,
  h2,
  div,
  a,
  input,
  small,
  footer,
  p,
  span,
  hr,
  br,
  img,
  button,
} = tagl(m);

const use = (v, f) => f(v);

// document.body.style.border = "2px solid red";

// Extension state
let tickers = []; // All tickers
let searchText = ""; // Search text in input field
let results = []; // Search results (subset of tickers)

// Fetch the tickers from github deployed json file
fetch("https://abulvenz.github.io/postillion-newsticker/tickers.json")
  .then((e) => e.json())
  .then((e) => {
    tickers = e;
    tickers.forEach((t) => (t.small = t.content.toLowerCase()));
  });

const resultElement = document.createElement("div");

// Using inline style for simpler packaging (I didn't read the docs with that regard :)
resultElement.style.position = "fixed"; // Fixed position
resultElement.style.left = "0"; // Left side of the screen
resultElement.style.bottom = "0"; // Bottom of the screen
resultElement.style.width = "100%"; // full broadside
resultElement.style.zIndex = "1000"; // Lift above page-content
resultElement.style.maxHeight = "50%"; // Do not cover the entire page
resultElement.style.overflowY = "auto"; // Scroll when content is higher than element
resultElement.style.overflowX = "break"; // Scroll when content is higher than element
resultElement.style.backgroundColor = "#333"; // Adjust background color
resultElement.style.color = "#fff"; // Adjust text color
resultElement.style.padding = "0.25em"; // Add some padding

// Stringify ticker when copying to the clipboard
const ticker2string = (ticker) => {
  return (
    "+++ " +
    ticker.content +
    " +++ " +
    ticker.creators.join("/") +
    " " +
    ticker.num
  );
};

// Image component
const imageC = (vnode) => ({
  view: ({ attrs: { ticker } }) =>
    ticker.image
      ? ticker.display
        ? [
            br(),
            img.thumbnail({
              onclick: () => (ticker.display = undefined),
              src: ticker.image.replace("w1600", "w800"),
            }),
          ]
        : a({ onclick: () => (ticker.display = true) }, " 🖼️")
      : null,
});

// Ticker component
const tickerC = (vnode) => {
  const { ticker } = vnode.attrs;
  return {
    view: () =>
      div.ticker(
        use(ticker?.content?.indexOf("++") >= 0, (systemSprenger) => [
          systemSprenger ? "" : "+++ ",
          m.trust(ticker.content),
          systemSprenger ? " " : " +++ ",
        ]),
        ticker.creators
          ? ticker.creators.map((creator, index) =>
              span([creator, index < ticker.creators.length - 1 ? "/" : " "])
            )
          : "[Fehler bei Autorenbestimmung] ",
        a(
          { href: ticker.url },
          ticker?.url?.indexOf("the-postillon.com") < 0 ? /*"🇩🇪"*/ "" : "🇬🇧",
          ticker.num || "Keine Nummer"
        ),
        m(imageC, { ticker }),
        " ",
        button(
          {
            onclick: (e) =>
              navigator.clipboard.writeText(ticker2string(ticker)),
          },
          "Kopieren"
        )
      ),
  };
};

const search = (selectedText) =>
  selectedText.length < 2
    ? []
    : tickers
        .filter((t) => t.small.indexOf(selectedText.toLowerCase()) > -1)
        .slice(0, 100);

m.mount(resultElement, {
  view: () => [
    results.map((ticker) => m(tickerC, { key: ticker.content, ticker })),
    input({
      value: searchText,
      oninput: (e) => {
        searchText = e.target.value;
        results = search(searchText);
      },
    }),
    button(
      {
        onclick: (e) => {
          searchText = "";
          results = [];
        },
      },
      "×"
    ),
  ],
});

// Add the element to the page
document.body.appendChild(resultElement);

// Connect to selection change event to trigger a new search
document.addEventListener("selectionchange", function () {
  var selectedText = window.getSelection().toString().trim();

  // Check if really something has been selected
  if (selectedText) {
    searchText = selectedText;
    const matches = search(selectedText);

    results = matches;
    resultElement.visible = true;

    // Since the event is not part of the mithril app, we need to trigger a redraw manually
    m.redraw();
  }
});
