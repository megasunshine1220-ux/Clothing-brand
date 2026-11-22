const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
export const products = [
{id:1,name:"The Sculpted Shirt",category:"Women",type:"Tops",kind:"Relaxed cotton poplin",price:2490,badge:"BESTSELLER",image:photo("photo-1598554747436-c9293d6a588f"),description:"A relaxed silhouette in breathable cotton, finished with thoughtful proportions."},
{id:2,name:"Everyday Overshirt",category:"Men",type:"Tops",kind:"Textured cotton blend",price:3290,badge:"NEW ARRIVAL",image:photo("photo-1618354691373-d851c5c3a990"),description:"An easy layer with a clean profile, designed for everyday movement."},
{id:3,name:"The Modern Co-ord",category:"Women",type:"Dresses",kind:"Two-piece set",price:4590,badge:"LIMITED EDIT",image:photo("photo-1595777457583-95e059d581b8"),description:"A considered two-piece set with an effortless drape."},
{id:4,name:"Essential Relaxed Tee",category:"Essentials",type:"Tops",kind:"Heavyweight jersey",price:1490,badge:"EVERYDAY",image:photo("photo-1521572163474-6864f9cf17ab"),description:"The everyday foundation in soft-touch jersey."},
{id:5,name:"The Linen Layer",category:"Men",type:"Tops",kind:"Linen blend",price:3790,badge:"NEW ARRIVAL",image:photo("photo-1618354691229-88d47f285158"),description:"Lightweight linen blend tailoring for warm days."},
{id:6,name:"Soft Form Dress",category:"Women",type:"Dresses",kind:"Fluid woven fabric",price:3990,badge:"AURÉ EDIT",image:photo("photo-1566174053879-31528523f8ae"),description:"An understated statement piece with fluid movement."},
{id:7,name:"Studio Sweatshirt",category:"Essentials",type:"Tops",kind:"Brushed cotton fleece",price:2790,badge:"CORE",image:photo("photo-1551028719-00167b16eac5"),description:"A soft, substantial layer for off-duty hours."},
{id:8,name:"Tailored Weekend Trouser",category:"Men",type:"Bottoms",kind:"Cotton twill",price:2990,badge:"AURÉ EDIT",image:photo("photo-1473966968600-fa801b869a1a"),description:"A versatile trouser with a neat taper and comfortable fit."},
{id:9,name:"Indigo Everyday Kurta",category:"Men",type:"Tops",kind:"Cotton kurta",price:2890,badge:"INDIAN EDIT",image:photo("photo-1617137968427-85924c800a22"),description:"A clean contemporary kurta silhouette for everyday occasions."},
{id:10,name:"Ivory Occasion Dress",category:"Women",type:"Dresses",kind:"Soft occasion wear",price:5490,badge:"OCCASION",image:photo("photo-1566174053879-31528523f8ae"),description:"An elegant occasion silhouette with a soft flowing finish."},
{id:11,name:"Everyday Straight Jeans",category:"Men",type:"Bottoms",kind:"Structured denim",price:3190,badge:"CORE",image:photo("photo-1542272604-787c3835535d"),description:"A versatile straight-leg denim with an easy everyday fit."},
{id:12,name:"Drape Midi Dress",category:"Women",type:"Dresses",kind:"Fluid midi silhouette",price:4290,badge:"NEW ARRIVAL",image:photo("photo-1515347619252-60a4bf4fff4f"),description:"A softly draped midi dress designed to move with you."},
{id:13,name:"Relaxed Linen Shirt",category:"Men",type:"Tops",kind:"Breathable linen blend",price:3490,badge:"SUMMER EDIT",image:photo("photo-1603252110481-7ba873bf42ab"),description:"An airy shirt for warm days and layered looks."},
{id:14,name:"Pleated Wide-Leg Trouser",category:"Women",type:"Bottoms",kind:"Tailored woven fabric",price:3590,badge:"AURÉ EDIT",image:photo("photo-1594633312681-425c7b97ccd1"),description:"A flattering wide-leg shape with considered pleat details."},
{id:15,name:"Cotton Day Dress",category:"Women",type:"Dresses",kind:"Cotton daywear",price:3290,badge:"EVERYDAY",image:photo("photo-1496747611176-843222e1e57c"),description:"A comfortable day dress with a relaxed feminine shape."},
{id:16,name:"Essential Polo",category:"Men",type:"Tops",kind:"Cotton pique",price:1990,badge:"ESSENTIAL",image:photo("photo-1625910513413-5fc4b6c3b7b5"),description:"A timeless polo in a versatile everyday fit."},
{id:17,name:"Rosewood Anarkali",category:"Women",type:"Dresses",kind:"Flowing occasion silhouette",price:6290,badge:"OCCASION EDIT",image:photo("photo-1583391733958-d5f7f4c8a7b1"),description:"A graceful occasion silhouette with room for movement."},
{id:18,name:"Indigo Shirt Dress",category:"Women",type:"Dresses",kind:"Cotton shirt dress",price:3890,badge:"NEW ARRIVAL",image:photo("photo-1591369822096-ffd140ec948f"),description:"A relaxed shirt dress for everyday wear."},
{id:19,name:"Printed Summer Dress",category:"Women",type:"Dresses",kind:"Lightweight printed weave",price:3590,badge:"SUMMER EDIT",image:photo("photo-1496747611176-843222e1e57c"),description:"A light, easy dress for warm-weather days."},
{id:20,name:"Evening Drape Gown",category:"Women",type:"Dresses",kind:"Fluid occasion fabric",price:7990,badge:"OCCASION",image:photo("photo-1566174053879-31528523f8ae"),description:"A refined evening silhouette with a fluid drape."},
{id:21,name:"Textured Nehru Jacket",category:"Men",type:"Tops",kind:"Textured cotton blend",price:4290,badge:"INDIAN EDIT",image:photo("photo-1617137968427-85924c800a22"),description:"A contemporary layer inspired by classic Indian tailoring."},
{id:22,name:"Everyday Chino",category:"Men",type:"Bottoms",kind:"Cotton stretch twill",price:2790,badge:"CORE",image:photo("photo-1473966968600-fa801b869a1a"),description:"A clean everyday trouser with a comfortable straight fit."},
{id:23,name:"Women's Linen Shirt",category:"Women",type:"Tops",kind:"Breathable linen blend",price:3190,badge:"SUMMER EDIT",image:photo("photo-1603252110481-7ba873bf42ab"),description:"A relaxed linen layer for warm days."},
{id:24,name:"Women's Tailored Trouser",category:"Women",type:"Bottoms",kind:"Tailored woven fabric",price:3790,badge:"AURÉ EDIT",image:photo("photo-1594633312681-425c7b97ccd1"),description:"A versatile tailored trouser with a wide-leg shape."}
];

/*
 * These are illustrative demo specifications for the prototype, not verified supplier
 * test results or certified fibre-content claims. Replace them with manufacturer data
 * before selling real garments.
 */
const fabricSpecs = {
  Tops: {fabric:"Cotton poplin / cotton jersey (style dependent)", yarn:"Combed cotton yarn; compact-spun for a smoother surface", weave:"Plain weave for poplin; knitted single jersey for tees", feel:"Smooth, breathable and soft against the skin", weight:"Light to medium weight; varies by garment", finish:"Pre-washed demo finish; actual finish to be confirmed", care:"Wash inside out with similar colours; follow the final garment care label", fit:"Relaxed everyday fit; check the size guide"},
  Dresses: {fabric:"Fluid woven viscose blend or cotton (style dependent)", yarn:"Fine ring-spun yarn for a soft hand feel", weave:"Plain weave / twill weave depending on the design", feel:"Soft drape with a lightweight, flowing feel", weight:"Lightweight to medium weight", finish:"Soft-touch finish; final finish depends on production", care:"Gentle wash; dry in shade; follow the final garment care label", fit:"Designed for movement; check the size guide"},
  Bottoms: {fabric:"Cotton twill or structured denim (style dependent)", yarn:"Ring-spun cotton warp yarn; denim may use indigo-dyed warp yarn", weave:"Twill weave for diagonal texture and durability", feel:"Structured hand feel with comfortable movement", weight:"Medium weight; denim may be heavier", finish:"Garment wash / softener finish depending on style", care:"Wash inside out with similar colours; avoid harsh bleach", fit:"Regular or relaxed cut; check the size guide"}
};
products.forEach(product => {
  const spec = fabricSpecs[product.type] || fabricSpecs.Tops;
  product.quality = {...spec};
});
