/* https://habr.com/ru/post/334772/ */

"use strict"

function promise(context, func, ...params){

  // тут мы принимаем контекст, саму функцию (метод, если хотите) и всё что нужно передать в этот метод
  // оборачиваем вызов в промис
  return new Promise( resolve => {

    // собственно, вызов из нужного контекста 
    func.call(context, ...params, (...callbackParams) => {

      // а это наш колбэк, который мы отдаем в resolve, предварительно отпарсив результат в удобный вывод (см. ниже ф-ию promiseToAssoc);

      let returnObject = promiseToAssoc([...callbackParams]);

        resolve( returnObject );

      })
    })
}

/* вспомогательная функция для разбора ответа от промисифицированной функции */

function promiseToAssoc(results){

  let res = {};
  // первые 3 объекта, которые приходят в колбэк мы по дефолту назовем err, res и body
  let assoc = ['err', 'res', 'body'];

  for(let i = 0; i < results.length; i++){
    // остальные объекты (если они есть) будем называть field_3, field_4 и тд.
    let field = assoc[i] || `field_${i}`;
    res[ field ] = results[i];
  }

  return res;
}

module.exports = promise;