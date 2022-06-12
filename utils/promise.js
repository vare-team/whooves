/* https://habr.com/ru/post/334772/ */

/**
 * @function
 * @param context
 * @param func
 * @param params
 * @returns {Promise<{err, res, body, ...}>}
 */
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

/**
 *
 * @function
 * @param {array} results
 * @returns {{err, res, body, ...}}
 */
function promiseToAssoc(results){
  let res = {};
  let assoc = ['err', 'res', 'body'];
  for(let i = 0; i < results.length; i++){
    // остальные объекты (если они есть) будем называть field_3, field_4 и тд.
    res[ assoc[i] || `field_${i}` ] = results[i];
  }
  return res;
}

module.exports = promise;