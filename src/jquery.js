window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  //两个 = 在一行，执行顺序为从右往左
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
      //获取elements后可以直接调用fn操作elements 所以 jQuery 会return 一个对象,而不是elements
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  const api = Object.create(jQuery.prototype);

  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi,
    //end() 返回的是api，api是没有oldApi的，所以需要构造一个
  });
  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
      //这里是一个闭包，addClass函数访问外部的elements（此时浏览器不会清除elements，因此可以实现链式操作）
    }
    return this;
    //return this 链式操作，方便多次调用自己
    /*
      调用该函数 api.addClass(x) === api.addClass.call(api,x)
     */
  },

  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      const elements2 = Array.from(this.elements[i].querySelectorAll(selector));
      //找到有selector的所有元素（querySelector得到的是伪数组,直接concat会把elements2全部放到一个key里面）
      array = array.concat(elements2);
    }
    array.oldApi = this;
    //由于返回上一个api
    return jQuery(array);
  },

  end() {
    return this.oldApi;
  },
  //返回上一个api

  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },

  parent() {
    const array = [];

    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        //防止多次push重复的parentNode
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
    //返回的是可操作的对象
  },

  children() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.children) === -1) {
        array.push(...node.children);
        //... 展开操作符
      }
    });
    return jQuery(array);
  },

  print() {
    console.log(this.elements);
  },

  appendTo(node) {
    //把xxx追加到node中
    if (node instanceof Element) {
      this.each((el) => node.appendChild(el));
    } else if (node.jquery === true) {
      this.each((el) => node.get(0).appendChild(el));
    }
  },

  get(index) {
    return this.elements[index];
  },
};
