<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:r="ConsultantTreeMLM"
    exclude-result-prefixes="r">

    <!-- Указываем текстовый вывод, чтобы не было лишних XML тегов -->
    <xsl:output method="text" encoding="UTF-8"/>
    <!-- Объявляем параметры -->
    <xsl:param name="fromDate" />
    <xsl:param name="toDate" />
    
    <xsl:template match="/">
[
    <xsl:for-each select="r:Report/r:table1/r:Detail_Collection/r:Detail[
        translate(@DREGDATE, '-:T', '') &gt;= translate($fromDate, '-:T', '') and 
        translate(@DREGDATE, '-:T', '') &lt;= translate($toDate, '-:T', '') and
        @SBSENDMAIL = 'Да'
    ]">
        <xsl:variable name="parentId" select="string(@NNUMBERPARENT)" />
        <xsl:variable name="tutor" select="//r:Detail[string(@textbox18) = $parentId]" />
        {
          "name": "<xsl:value-of select="@textbox19"/>",
          "lastname": "<xsl:value-of select="@SLASTNAME"/>",
          "firstname": "<xsl:value-of select="@SFIRSTNAME"/>",
          "patronymic": "<xsl:value-of select="@SPATRONYMIC"/>",
          "regdate": "<xsl:value-of select="translate(substring(@DREGDATE, 1, 10), '-', '.')"/>",
          "email": "<xsl:value-of select="@textbox109"/>",
          "tutor_name": "<xsl:value-of select="$tutor/@textbox19"/>",
          "tutor_phone": "<xsl:value-of select="$tutor/@textbox111"/>",
          "tutor_email": "<xsl:value-of select="$tutor/@textbox109"/>"
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
]
    </xsl:template>
</xsl:stylesheet>
