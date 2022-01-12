const md = {
    //标题
    "title" : (title,level) => {
        level = level > 6 ? 6 : level
        return "#".repeat(level) + ' ' + title  + "\n";
    },
  //分割线
  "split": () =>  "--- \n",
  "noSortList" : (value) =>  "* " + value +  "\n",
  "sortList" : (value,sort) =>  sort +  ". " + value +  "\n",
  "jsonCode" : (value) =>  "```json \n" + value + " \n```" + "\n",
  "table" : (t,data) => {
     let head =  '|' + t.join('|') + '|' + "\n";
    let s = "";
    t.forEach((x) => s = s.concat('|--'))
    s = s + "| \n";
   let body = "";
   data.forEach((items) => {
      body =  body.concat('|' + items.join('|') + '|' + '\n')
   })
   return head + s + body;
  }
    
}

export default  md;