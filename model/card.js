const Lesson = require("./lesson");
const path = require("path");
const fs = require("fs");

const dir = path.join(require.main.filename, "..", "data", "card.json");

class Card {
  static async add(id) {
    const lesson = await Lesson.findById(id); // {}
    const data = await Card.fetch();

    const idx = data.items.findIndex((item) => item.id === id); // 0 1 2 3 3 56 6 65 / -1

    if (idx < 0) {
      // demak dars korzinada yo'q uni qo'shish kerak
      lesson.count = 1;
      data.items.push(lesson);
    } else {
      // demak dars korzinada bor uni sonini 1 ga oshirib qo'yamiz
      data.items[idx].count++;
    }

    data.price = +data.price + +lesson.price;

    return new Promise((res, rej) => {
      fs.writeFile(dir, JSON.stringify(data), (err) => {
        if (err) rej(err);
        else res(data.items);
      });
    });
  }

  static async fetch() {
    return new Promise((res, rej) => {
      fs.readFile(dir, "utf-8", (err, data) => {
        // console.log(JSON.parse(data).price);
        if (err) rej(err);
        else res(JSON.parse(data));
      });
    });
  }
  static async remove(id) {
    const main = await Card.fetch();
    const ViewCard = main.items.findIndex((les) => les.id === id);
    if (main.items[ViewCard].count === 1) {
        main.items.splice(ViewCard, 1);
    } else {
        main.items[ViewCard].count--;
    }

    fs.writeFile(dir, JSON.stringify(main), (err) => {
      if (err) rej(err);
      else res();
    });
  }
}

module.exports = Card;
