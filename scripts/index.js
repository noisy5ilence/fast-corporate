(function () {
  const SERVER_URL = 'https://cors-anywhere.herokuapp.com/https://veryfast.io';

  const fetchData = query => {
    return fetch(`${ SERVER_URL }${ query }`)
    .then(response => response.json())
    .catch(error => console.error('Error: ', error));
  }

  const getProducts = () => {
    return fetchData('/t/front_test.json').then(data => data?.result?.elements || []);
  };

  const isPerMonth = licenseName => licenseName?.toLowerCase()?.includes('month');

  const renderProducts = products => {
    const productsListElement = document.querySelector('[data-products]');
    const discountIcon = document.querySelector('[data-discont-icon]');
    const downloadIcon = document.querySelector('[data-download-icon]');

    products.reduce((products, {
      amount,
      license_name: licenseName,
      name_prod: nameDisplay,
      is_best: isBest,
      link,
      amount_html: amountHtml,
      price_key: priceKey
    }) => {
      const item = document.createElement('li');

      const [ fullPrice ] = amountHtml?.split('</strike>') || [];

      const isDiscount = priceKey?.includes('50%');

      item.classList.add('main__products__product');
      item.innerHTML = `
        <div class="product">
          <div class="product__price">
            ${ isDiscount ? `<span class="product__price__discount">${ discountIcon.innerHTML }</span>` : '' }
            ${ isBest ? `<label class="product__price__label">Best value</label>` : '' }
            <span class="product__price__wrapper">
              <span class="product__price__value">$${ amount }</span>
              <span class="product__price__per">/${ isPerMonth(licenseName) ? 'MO' : 'PER YEAR' }</span>
            </span>
            ${ fullPrice ? `<span class="product__price__full">${ fullPrice }</span>` : '' }
          </div>
          <div class="product__name">
            <span class="product__title">${ nameDisplay }</span>
            <span class="product__period">${ licenseName }</span>
          </div>
          <button class="product__download" tabindex="-1">
            <a href="${ link }" data-download-link>download</a>
            <span class="product__download__icon">${ downloadIcon.innerHTML }</span>
          </button>
        </div>  
      `;
      products.appendChild(item)
      return products;
    }, productsListElement);
  };

  const arrowTemplate = document.querySelector('[data-download-arrow]');
  let isArrowAlreadyShowed = false;

  getProducts().then(renderProducts);

  document.addEventListener('click', event => {
    if (event.target.getAttribute('data-download-link') !== null && !isArrowAlreadyShowed) {
      const isFirefox = typeof InstallTrigger !== 'undefined';
      const isSafari = !!window.safari;

      const arrow = arrowTemplate.content.cloneNode(true).querySelector('.product__arrow');

      arrow.classList.add((isFirefox || isSafari) ? 'product__arrow_top' : 'product__arrow_bottom');

      document.body.appendChild(arrow);

      isArrowAlreadyShowed = true;
    }
  });
})();