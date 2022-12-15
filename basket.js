class Good {

    constructor(id, name, description, sizes, price, available) {
        this.id = id;       //Код товара
        this.name = name;       //Наименование
        this.description = description;     //Описание
        this.sizes = sizes;     //массив возможных размеров
        this.price = price;     //цена товара
        this.available = available;        //Признак доступности для продажи
    }


    set setAvailable(value) {
        this.available = value;
    }
}; 

class GoodsList {
    #goods;

    constructor(good, sortPrice = false, sortDir = true) {
        this.#goods = [good];
        this.filter = 0;
        this.sortPrice = Boolean(sortPrice);
        this.sortDir = Boolean(sortDir);
    }

    addGood(items) {
        items.forEach(element => this.#goods.push(element));        
    }

    set setFilter(filterValue) {
        let regexp = new RegExp(`${filterValue}`, 'gi');
        this.filter = regexp;
    }

    get list() {

        let filteredGoods;

        if (this.filter.test('all')) {
            filteredGoods = this.#goods.filter(good => good.available === true);
        } else {
        filteredGoods = this.#goods.filter(good => good.available === true && this.filter.test(good.name));
        }

        if (this.sortPrice) {
            return filteredGoods
                .sort(this.sortDir
                    ? ((a, b) => a.price - b.price)
                    : ((a, b) => a.price - b.price));
        } else {
            return filteredGoods;
        }
    }

    remove(id) {
        let goodIndex = this.#goods.findIndex(item => item.id === id);
        this.#goods.splice(goodIndex, 1);
    }
}

class BasketGood extends Good {
    constructor(good, amount) {
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;
    }
}

class Basket {
    goods;

    constructor(good, amount) {
        this.goods = [new BasketGood(good, amount)];
    }

    add(good, amount) {
        let itemIndex = this.goods.findIndex(item => item.id === good.id);
        if (itemIndex === -1) {
            this.goods.push(new BasketGood(good, amount));
        } else {
            this.goods[itemIndex].amount += amount;
        }
    }

    remove(good, amount) {
        let itemIndex = this.goods.findIndex(item => item.id === good.id);
        if((this.goods[itemIndex].amount - amount) > 0) {
            this.goods[itemIndex.amount] -= amount;
        } else {
            this.goods.splice(itemIndex, 1);
        }
    }

    get totalAmount() {
        return this.goods.reduce((sum, current) => sum + current.amount, 0);
    }

    get totalSum() {
        let sum = 0;
        this.goods.forEach(item => sum += item.amount * item.price);
        return sum;
    }

    clear() {
        this.goods.length = 0;
    }

    removeUnavailable() {
        this.goods = this.goods.filter(item => item.available === true);
    }
}

const jeans = new Good(1, 'Джинсы', 'Порезаны ветром', [32, 34, 36], 2300, true);
const sneakers = new Good(2, 'Кеды', 'Со звездами', [37, 41, 45], 5200, true);
const tshirt = new Good(3, 'Футболка', 'Белая', [44, 46, 48], 1200, true);
const bag = new Good(4, 'Сумка', 'Кожа', [40, 41, 42], 3850, true);
const socks = new Good(5, 'Носки', 'Черные', [37, 41, 45], 500, true);

bag.setAvailable = false;
socks.setAvailable = false;

const goodsList = new GoodsList(jeans);
goodsList.addGood([jeans, sneakers, tshirt, bag, socks]);
goodsList.setFilter = 'Кеды';
goodsList.sortPrice = true;
goodsList.sortDir = false;
console.log('Cписок :\n', goodsList.list);
goodsList.remove(7);

const basket = new Basket(tshirt, 5);
basket.add(tshirt, 2);
basket.add(sneakers, 1);
basket.add(bag, 1);
basket.remove(tshirt, 1);
basket.remove(tshirt, 6);
// basket.clear();
// basket.removeUnavailable();
console.log('Количество: ', basket.totalAmount);
console.log('Сумма: ', basket.totalSum);