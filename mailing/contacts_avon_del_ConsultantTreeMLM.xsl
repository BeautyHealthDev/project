<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:r="ConsultantTreeMLM"
    exclude-result-prefixes="r">

    <!-- Указываем текстовый вывод, чтобы не было лишних XML тегов -->
    <xsl:output method="text" encoding="UTF-8"/>
    
    <!-- Объявляем параметр в начале файла (вне шаблонов) -->
    <xsl:param name="allowedNumbers" /> 
    <xsl:template match="/">
[
    <!-- Универсальный фильтр: ищет номер в строке-параметре -->
    <xsl:for-each select="r:Report/r:table1/r:Detail_Collection/r:Detail[
        contains($allowedNumbers, concat(' ', @textbox18, ' '))
    ]">
         <xsl:variable name="parentId" select="string(@NNUMBERPARENT)" />
         <xsl:variable name="tutor" select="//r:Detail[string(@textbox18) = $parentId]" />                           

        {
          "cons_number": "<xsl:value-of select="@textbox18"/>",
          "name": "<xsl:value-of select="@textbox19"/>",
          "tutor_name": "<xsl:value-of select="$tutor/@textbox19"/>",
          "pv": "<xsl:value-of select="r:Group1_Collection/r:Group1/@Textbox1264"/>"
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
]
    </xsl:template>
</xsl:stylesheet>
