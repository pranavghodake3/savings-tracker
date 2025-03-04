const categories = {
    "Savings": ['RD', 'SIP', 'BOM', 'IDBI'],
    "Lent": ['Sant', 'Abhi'],
    "Lent Received": ['Sant', 'Abhi'],
    "Kharch": [],
  };
  const dbCategories = [
    {
      id: 1,
      name: 'Savings',
      parent: 0
    },
    {
      id: 2,
      name: 'RD',
      parent: 1
    },
    {
      id: 3,
      name: 'SIP',
      parent: 1
    },
    {
      id: 4,
      name: 'Lent',
      parent: 0
    },
    {
      id: 5,
      name: 'Sant',
      parent: 4
    },
    {
      id: 6,
      name: 'Abhi',
      parent: 4
    },
    {
      id: 7,
      name: 'Lent Received',
      parent: 0
    },
    {
      id: 8,
      name: 'Kharch',
      parent: 0
    },
  ];
  const arrangedDBCategories = {};
  function arrangeDBCategoriesFun() {
    dbCategories.forEach(e => {
      arrangedDBCategories[e.id] = e;
    });
    console.log("arrangedDBCategories: ", arrangedDBCategories)
  }
  arrangeDBCategoriesFun();
  
  
  
  const trans = [
    {
      date: '2025-01-01',
      Category: 'Savings',
      Sub: 'RD',
      amount: 100
    },
    {
      date: '2025-01-01',
      Category: 'Savings',
      Sub: 'SIP',
      amount: 200
    },
    {
      date: '2025-01-01',
      Category: 'Savings',
      Sub: 'BOM',
      amount: 50
    },
    {
      date: '2025-01-01',
      Category: 'Savings',
      Sub: 'BOM',
      amount: 50
    },
    {
      date: '2025-01-01',
      Category: 'Lent',
      Sub: 'Sant',
      amount: 200
    },
    {
      date: '2025-01-01',
      Category: 'Lent',
      Sub: 'Abhi',
      amount: 200
    },
    {
      date: '2025-01-01',
      Category: 'Lent Received',
      Sub: 'Sant',
      amount: 100
    },
    {
      date: '2025-01-01',
      Category: 'Lent Received',
      Sub: 'Abhi',
      amount: 10
    },
    {
      date: '2025-01-01',
      Category: 'Kharch',
      Sub: 'BOM',
      amount: 10
    },
  ];
  const newTrans = [];
  function addTrans(body) {
    const { date, Category, existingSub, newSub, amount } = body;
    const finalSub = existingSub ? existingSub : newSub;
    let subId = existingSub;
    if (newSub) {
      subId = dbCategories.length + 1;
      dbCategories.push({ id: subId, name: newSub, parent: arrangedDBCategories[Category].id });
      arrangeDBCategoriesFun();
    }
    newTrans.push({ date, Category: arrangedDBCategories[Category].name, Sub: arrangedDBCategories[subId].name, amount });
  }
  
  function calculateTotal(arr) {
    const savings = {
      savings: {},
      lent: {},
      kharch: 0,
      totalAmount: 0,
    };
    arr.forEach(e => {
      if (e.Category == "Savings") {
        if (typeof savings.savings[e.Sub] == 'undefined') savings.savings[e.Sub] = 0;
        savings.savings[e.Sub] += e.amount;
        savings.totalAmount += e.amount;
      }
      if (e.Category == "Lent") {
        if (typeof savings.lent[e.Sub] == 'undefined') savings.lent[e.Sub] = 0;
        savings.lent[e.Sub] += e.amount;
        savings.totalAmount += e.amount;
      }
      if (e.Category == "Lent Received") {
        savings.lent[e.Sub] -= e.amount;
        savings.totalAmount -= e.amount;
      }
      if (e.Category == "Kharch") {
        savings.savings[e.Sub] -= e.amount;
        savings.kharch += e.amount;
        savings.totalAmount -= e.amount;
      }
    });
    console.log("savings: ", savings)
  }
  
  calculateTotal(trans)
  
  addTrans({
    date: '2025',
    Category: 1,
    existingSub: 2,
    newSub: '',
    amount: 100
  });
  addTrans({
    date: '2025',
    Category: 1,
    existingSub: null,
    newSub: 'BOM',
    amount: 300
  });
  addTrans({
    date: '2025',
    Category: 1,
    existingSub: 3,
    newSub: '',
    amount: 200
  });
  addTrans({
    date: '2025',
    Category: 8,
    existingSub: 3,
    newSub: '',
    amount: 10
  });
  addTrans({
    date: '2025',
    Category: 4,
    existingSub: 5,
    newSub: '',
    amount: 200
  });
  addTrans({
    date: '2025',
    Category: 7,
    existingSub: 5,
    newSub: '',
    amount: 20
  });
  addTrans({
    date: '2025',
    Category: 4,
    existingSub: 6,
    newSub: '',
    amount: 200
  });
  addTrans({
    date: '2025',
    Category: 7,
    existingSub: 6,
    newSub: '',
    amount: 10
  });
  console.log("newTrans: ", newTrans)
  calculateTotal(newTrans);
  