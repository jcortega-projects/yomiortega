module.exports = function (eleventyConfig) {
  // Copiar tal cual estas carpetas al sitio final
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Filtro: formatear fecha en español (ej. "1 de junio de 2026")
  eleventyConfig.addFilter("fechaEs", (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    });
  });

  // Filtro: texto con acentos dorados. *palabra* -> dorado; salto de línea -> <br>
  // (escapa HTML primero, así el contenido de Yomi nunca puede romper la página)
  eleventyConfig.addFilter("rico", (texto) => {
    if (!texto) return "";
    const esc = String(texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc
      .replace(/\*([^*]+)\*/g, '<span class="gold">$1</span>')
      .replace(/\r?\n/g, "<br>");
  });

  // Filtro: convertir cualquier enlace de YouTube en URL para incrustar
  eleventyConfig.addFilter("youtubeEmbed", (url) => {
    if (!url) return "";
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
