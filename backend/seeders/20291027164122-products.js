'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let products = [];
    const images = [
      'https://i1.adis.ws/i/boohooamplience/dzz11660_mid%2520blue_xl?$product_page_main_magic_zoom$',
      'https://s7d5.scene7.com/is/image/UrbanOutfitters/47678354_093_f?$xlarge$&hei=900&qlt=80&fit=constrain',
      'https://anninc.scene7.com/is/image/LO/396392_9000?$pdp2x$',
      'https://www.ripcurl.com.au/assets/images/2019/01/21/GDECM1-3807-1jpg-19c361e3-0845-4432-aab2-03fbe8c82c6b.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/918ELvCSziL._UY606_.jpg',
      'https://cdn.shopify.com/s/files/1/0738/6177/products/LaneJeanNo9-DarkIndigoDenim_1970_2000x.jpg?v=1494279957',
      'https://media.missguided.com/s/missguided/G1805865_set/1/blue-sinner-vintage-wash-distressed-knee-high-waisted-skinny-jeans',
      'https://anninc.scene7.com/is/image/LO/442552_1264_D1?$pdp2x$',
      'https://www.wrangler.co.uk/media/catalog/product/cache/0/image/3f5d3f29ea98d118e7100aed043665f8/import/item/1/W12175001.jpg',
      'https://5.imimg.com/data5/GY/QN/MY-3241133/zara-women-jeans-500x500.jpeg',
      'https://www.sassymania.nl/images/productimages/big/vintage-inspired-hoge-taille-broek-met-bretels-2-.jpg',
      'https://www.sassymania.nl/images/productimages/big/vintage-houndstooth-swing-jurk.jpg',
      'https://c.76.my/Malaysia/free-size-vintage-fashion-ladies-fashion-dress-ch3171-ss4414-1907-31-SS4414@3.jpg',
      'http://artscapewychwoodbarns.ca/wp-content/uploads/2017/02/VCFlyer2017-e1487688039654.jpg',
      'https://cdn11.bigcommerce.com/s-ut7esxk/images/stencil/1280x1280/products/2175/38931/SP00190__46167.1504774574.jpg?c=2&imbypass=on',
      'https://www.sassymania.nl/images/productimages/big/dolores-retro-rockabilly-swing-jurk.jpg',
      'https://www.refinery29.com/images/8535304.jpg?format=webp&width=720&height=1080&quality=85',
      'https://www.britishretro.co.uk/wp-content/uploads/2019/08/Royal-stewart-tartan-swing-dress.jpg',
      'http://vintageindustrialstyle.com/wp-content/uploads/2017/10/The-7-Vintage-Style-Fashion-Bloggers-You-Need-To-Know-6.jpg',
      'https://ae01.alicdn.com/kf/HTB1udhsClyWBuNkSmFPq6xguVXaw/New-Fashion-Women-Vintage-Dress-50-60s-Retro-Style-Polka-Dot-Rockabilly-Pinup-Empire-Dress-Evening.jpg',
      'https://p7013279.vo.llnwd.net/e1/media/catalog/product/9/2/92600076016110_1.jpg',
      'https://img1.cohimg.net/is/image/Coach/77971b_svp1y_a0?$plpMob$',
      'https://lp2.hm.com/hmgoepprod?set=source[/f1/0c/f10c38ab4ea4684ee301ed7c415b712a038817fc.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[z],hmver[1]&call=url[file:/product/main]',
      'https://target.scene7.com/is/image/Target//GUEST_ecb9744d-69c0-4ccb-bc7e-4700e44687c8?wid=315&hei=315&qlt=60&fmt=pjpeg',
      'https://media.monsoon.co.uk/assets/images/accessorize/homepage/2019/Aug/02082019_GL/bags.jpg',
      'https://www.bootbarn.com/dw/image/v2/BCCF_PRD/on/demandware.static/-/Sites-master-product-catalog-shp/default/dw55043e99/images/002/2000224002_100_P2.JPG',
      'https://assets.adidas.com/images/w_385,h_385,f_auto,q_auto:sensitive,fl_lossy/f2ea06c2316e4efca6a8aa2500fe4a80_9366/adicolor-classic-backpack.jpg',
      'https://www.catofashions.com/prodimages/71474-DEFAULT-s.jpg',
      'https://www.vestigebestdeals.com/media/catalog/category/WoMens-Accessories-1.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqLnaTBe9dsefIyOm41N5ww8YSvZdbBblPXq1M_nFbb-LrMArUZA&s',
      'https://images-na.ssl-images-amazon.com/images/I/71O-rzsRavL._UX679_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/71RJ6Rk8gQL._UL1310_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/61Dy2Tg0v9L._UX342_.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Nw4N-jbka4mzItObiZqeH1HVuetxtrsqZnQuvgj6Qiync6Lt&s',
      'http://seventees.pk/wp-content/uploads/2018/04/3-5.jpg',
      'https://i.ebayimg.com/images/g/ogcAAOSwH3hZ50Kg/s-l300.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/617FUjl3EXL._UL1500_.jpg',
      'https://www.dhresource.com/0x0/f2/albu/g5/M00/07/EF/rBVaJFjP7WuAO4uYAAJTnTzI90Q127.jpg',
      'https://ae01.alicdn.com/kf/HTB1ChgxXIfrK1RkSmLyq6xGApXaq/CIVO-Fashion-Watch-Men-Waterproof-Slim-Mesh-Strap-Minimalist-Wrist-Watches-For-Men-Quartz-Sports-Watch.jpg',
      'https://bymenow.com/wp-content/uploads/2019/04/MEGALITH-Fashion-Men-s-LED-Sport-Quartz-Watch-Men-Waterproof-Date-Military-Multifunction-Wrist-Watches-Men.jpg',
      'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374306/01/sv01/fnd/PNA',
      'https://cdn.shopify.com/s/files/1/0238/2821/products/Womens-193-Royale-Blanco-3RMW-Product-102.jpg?v=1563992609',
      'https://cdn.shopify.com/s/files/1/1718/2067/products/basso-ruby-light-sneakers-sneakers-black-purple-us-4-eu-35-4420149280791_2000x.png?v=1559802085',
      'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/355462/01/sv01/fnd/PNA',
      'https://image.tfgmedia.co.za/image/1/process/486x486?source=http://cdn.tfgmedia.co.za/06/ProductImages/56608817.jpg',
      'https://n.nordstrommedia.com/id/sr3/af86b614-e62c-4209-9206-bf992d777963.jpeg?crop=pad&pad_color=FFF&format=jpeg&trim=color&trimcolor=FFF&w=780&h=838',
      'https://rukminim1.flixcart.com/image/714/857/jmwch3k0/shoe/j/y/n/dg-292-white-blue-patti-10-digitrendzz-white-original-imaf9p36fkykfjqt.jpeg?q=50',
      'https://cdn-images.farfetch-contents.com/12/96/98/30/12969830_13769318_480.jpg',
      'https://www.ashfootwear.co.uk/images/ash-addict-sneakers-black-leather-red-mesh-p2690-80959_image.jpg',
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/165930c-a-107x1-1570029858.jpg?crop=1.00xw:0.539xh;0,0.224xh&resize=1200:*',
      'https://cdn.shopify.com/s/files/1/0055/1242/products/IND4000C-BLUA_0a0782f9-3c05-44a5-86c6-14b16f48ac73_2048x.jpg?v=1555356508',
      'https://cdn.shopify.com/s/files/1/2477/3840/products/d0b9ebb664ba15f54d1fceb7177d3cb6_1200x.jpg?v=1543889030',
      'https://images-na.ssl-images-amazon.com/images/I/61h5zZ-Zj8L._UX679_.jpg',
      'https://5.imimg.com/data5/JM/SF/MY-33105535/plain-mens-sweatshirts-500x500.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/613CKZIR6nL._UX522_.jpg',
      'https://cdn.shopify.com/s/files/1/2349/3299/products/KINDNESS_CREW_PINK_grande.jpg?v=1527480718',
      'https://cdn.shopify.com/s/files/1/0055/1242/products/SS4500-LAV-1_ff7dcacf-9296-456f-9365-341bcbfdde27_2048x.jpg?v=1562106890',
      'https://www.cornellstore.com/site/Product_images/9000370_media-Red-01.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/91VuamAm0RL._UX569_.jpg',
      'https://www.dhresource.com/0x0s/f2-albu-g8-M00-8B-D9-rBVaV1y1sTaAYU4HAAPWSkO66cw079.jpg/stranger-sweatshirt-new-tv-show-women-clothes.jpg',
      'https://static.bhphoto.com/images/images1000x1000/1536120359_1433711.jpg',
      'https://static.bhphoto.com/images/images2500x2500/1455749513_1225877.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/81naihI0PmL._SL1500_.jpg',
      'https://images-na.ssl-images-amazon.com/images/I/914hFeTU2-L._SL1500_.jpg',
      'https://icdn6.digitaltrends.com/image/digitaltrends/fujifilm-x-t30-hands-on-7174-2-720x720.jpg',
      'https://www.sony.com/image/710a83a2d82ce8e30543b68b7e5a0c44?fmt=pjpeg&bgcolor=FFFFFF&bgc=FFFFFF&wid=2515&hei=1320',
      'https://brain-images-ssl.cdn.dixons.com/4/7/10142574/l_10142574_003.jpg',
      'https://www.camerahouse.com.au/media/catalog/product/cache/image/700x400/e9c3970ab036de70892d86c6d221abfe/m/5/m50kis.png',
      'https://www.adorama.com/images/Large/lcvlux5.jpg',
      'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fs3-ap-northeast-1.amazonaws.com%2Fpsh-ex-ftnikkei-3937bb4%2Fimages%2F5%2F1%2F8%2F0%2F20370815-2-eng-GB%2FCropped-1555509431RTS22VSA.jpg?source=nar-cms',
      'https://images-na.ssl-images-amazon.com/images/I/51vTNmlvNmL._SL1000_.jpg',
      'https://images.lampsplus.com/is/image/b9gt8/v1854?qlt=65&wid=780&hei=780&op_sharpen=1&fmt=jpeg',
      'https://images.homedepot-static.com/productImages/fd27cd76-fd25-4a40-b023-ccff56a2cd90/svn/rhodes-bronze-hampton-bay-floor-lamps-hd09999frbrzc-64_1000.jpg',
      'https://www.ikea.com/PIAimages/0609329_PE684454_S5.JPG',
      'https://images-na.ssl-images-amazon.com/images/I/515gOozQ1KL._SX425_.jpg',
      'https://media.4rgos.it/i/Argos/7644191_R_Z001A?w=750&h=440&qlt=70',
      'https://images.homedepot-static.com/productImages/967ebf56-03e4-48c3-90ea-43875341a53d/svn/rhodes-bronze-hampton-bay-table-lamps-hd09999tlbrzc-64_1000.jpg',
      'https://www.ikea.com/PIAimages/0610458_PE685517_S5.JPG',
      'https://cdn.habitat.co.uk/media/catalog/product/cache/1/image/1200x925/9df78eab33525d08d6e5fb8d27136e95/4/5/456046.jpg',
      'https://image.lampsplus.com/is/image/cropped/U2560cropped.fpx?qlt=65&wid=780&hei=780&op_sharpen=1&fmt=jpeg',
      'https://cdn.pocket-lint.com/r/s/1200x/assets/images/147776-phones-review-hands-on-galaxy-fold-review-image1-njrtp2eeuj.jpg',
      'https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/apple-iphone-xr/black/Apple-iPhoneXr-Black-1-3x.jpg',
      'https://image.samsung.com/us/smartphones/galaxy-s9/phones/S9/Purple/0914-GI-GS9-PDP-Front-Purple.jpg',
      'https://www.boostmobile.com/content/dam/boostmobile/en/products/phones/samsung/galaxy-s10e/white/device-front.png.transform/pdpCarousel/image.jpg',
      'https://cdn.mos.cms.futurecdn.net/T6Gy5UWcrZKSzBe9ytrRXd-768-80.jpg',
      'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1551208882-samsung-galaxy-s10e-smartphone-1550695757.jpg',
      'https://www.91-img.com/pictures/134124-v5-oppo-k3-mobile-phone-large-1.jpg?tr=h-330,q-75',
      'https://i.gadgets360cdn.com/products/large/1530777269_635_jio_phone_2.jpg',
      'https://assets.pcmag.com/media/images/569181-ce-phone-project-01.jpg?width=640&height=471',
      'https://media.4rgos.it/i/Argos/8374257_R_Z001A?w=750&h=440&qlt=70',
      'https://store.hp.com/CanadaStore/Html/Merch/Images/c06268650_1750x1285.jpg',
      'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6326/6326270_sd.jpg',
      'https://media.flixfacts.com/inpage/hp/pavilion/silver_images/big4.jpg',
      'https://store.hp.com/CanadaStore/Html/Merch/Images/c05958960_1750x1285.jpg',
      'https://media.4rgos.it/i/Argos/8684576_R_Z001A?w=750&h=440&qlt=70',
      'https://azcd.harveynorman.com.au/media/catalog/product/cache/21/image/992x558/9df78eab33525d08d6e5fb8d27136e95/4/l/4lg38pa.jpg',
      'https://media.4rgos.it/i/Argos/8958295_R_Z001A?w=750&h=440&qlt=70',
      'https://azcd.harveynorman.com.au/media/catalog/product/r/a/razer-blade-15-c1nt-15-6-inch-gaming-laptop-1.jpg',
      'https://zdnet1.cbsistatic.com/hub/i/r/2019/04/17/1f68c3a6-495e-4325-bc16-cc531812f0ec/thumbnail/770x433/84ff4194826e8303efb771cd377a854f/chuwi-herobook-header.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqLMVRlATdIpPWmZjGo_kOwilvRedGfwmrpdQboTF6eBkpXXx6&s'
    ];

    const helperFunction = (index, j, subcategoryId, { min, max }) => {
      for (let i = index; i < j; i++) {
        let date = new Date();
        let startDate = new Date(date);
        let newDate = new Date(startDate);
        startDate.setDate(startDate.getDate() + faker.random.number(1));
        newDate.setDate(startDate.getDate() + faker.random.number(30));
        let brandId = min === max ? min : Math.floor(Math.random() * (max - min + 1) + min);

        products.push({
          name: faker.commerce.productName(),
          details: faker.lorem.paragraph(),
          picture: images[i],
          price: faker.commerce.price() + 1,
          featured: faker.random.boolean(),
          auctionStart: startDate,
          auctionEnd: newDate,
          userId: Math.floor(Math.random() * 2 + 1),
          subcategoryId,
          brandId
        });
      }
    };
    helperFunction(0, 10, 1, { min: 5, max: 5 });
    helperFunction(10, 20, 2, { min: 5, max: 5 });
    helperFunction(20, 30, 3, { min: 9, max: 9 });
    helperFunction(30, 40, 4, { min: 4, max: 4 });
    helperFunction(40, 50, 5, { min: 1, max: 2 });
    helperFunction(50, 60, 6, { min: 1, max: 2 });
    helperFunction(60, 70, 7, { min: 10, max: 10 });
    helperFunction(70, 80, 8, { min: 11, max: 11 });
    helperFunction(80, 90, 9, { min: 7, max: 8 });
    helperFunction(90, 100, 10, { min: 6, max: 8 });
    return queryInterface.bulkInsert('Products', products, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
