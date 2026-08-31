<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:r="ConsultantTreeMLM"
    exclude-result-prefixes="r">

    <!-- Указываем текстовый вывод, чтобы не было лишних XML тегов -->
    <xsl:output method="text" encoding="UTF-8"/>

    <!-- 1. Определяем ключ (индекс) ОДИН РАЗ вне шаблонов -->
    <!-- Индексируем все Detail по значению их атрибута textbox18 -->
    <xsl:key name="detail-by-textbox" match="r:Detail" use="string(@textbox18)" />
    
    <xsl:template match="/">
[
    <!-- Универсальный фильтр: ищет номер в строке-параметре -->
    <xsl:for-each select="r:Report/r:table1/r:Detail_Collection/r:Detail[
        (number(r:Group1_Collection/r:Group1/@Textbox1258) &gt; 0.0) or
        (number(r:Group1_Collection/r:Group1/@Textbox1279) &gt; 0.0)
    ]">
        <xsl:variable name="parentId" select="string(@NNUMBERPARENT)" />
        <xsl:variable name="tutor" select="key('detail-by-textbox', $parentId)" />

        {
          "cons_number": "<xsl:value-of select="@textbox18"/>",
          "name": "<xsl:value-of select="@textbox19"/>",
          "lastname": "<xsl:value-of select="@SLASTNAME"/>",
          "firstname": "<xsl:value-of select="@SFIRSTNAME"/>",
          "patronymic": "<xsl:value-of select="@SPATRONYMIC"/>",
          "regdate": "<xsl:value-of select="translate(substring(@DREGDATE, 1, 10), '-', '.')"/>",
          "phone": "<xsl:value-of select="@textbox111"/>",
          "email": "<xsl:value-of select="@textbox109"/>",
          "utmsource": "<xsl:value-of select="@UTMSOURCE"/>",
          "pv": "<xsl:value-of select="r:Group1_Collection/r:Group1/@Textbox1258"/>",
          "tutor_name": "<xsl:choose>
              <xsl:when test="(contains(' 737127362 , 737450271 , 742949046 , 743435150 , 744610130 , 744995487 , 746130675 ', concat(' ', @textbox18, ' ')))">
                  <xsl:text></xsl:text>
              </xsl:when>
              <xsl:otherwise>
                  <xsl:value-of select="$tutor/@textbox19"/>
              </xsl:otherwise>
          </xsl:choose>"
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
]
    </xsl:template>
</xsl:stylesheet>
