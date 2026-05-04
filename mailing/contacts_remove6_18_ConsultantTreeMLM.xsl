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
    <xsl:for-each select="r:Report/r:table1/r:Detail_Collection/r:Detail[
        (r:Group1_Collection/r:Group1/@Textbox1255='Уд18') or
        (r:Group1_Collection/r:Group1/@Textbox1255='Уд6') 
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
          "tutor_name": "<xsl:value-of select="$tutor/@textbox19"/>",
          "no_pv_periods": "<xsl:value-of select="r:Group1_Collection/r:Group1/@Textbox1261"/>",
          "country": "<xsl:value-of select="@textbox98"/>",
          "region": "<xsl:value-of select="@textbox49"/>",
          "city": "<xsl:value-of select="@textbox49"/>",
          "orderdate": "<xsl:value-of select="translate(substring(@textbox33, 1, 10), '-', '.')"/>"
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
]
    </xsl:template>
</xsl:stylesheet>
