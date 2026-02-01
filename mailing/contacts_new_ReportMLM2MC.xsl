<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:r="ReportMLM2MC"
    exclude-result-prefixes="r">

    <!-- Указываем текстовый вывод, чтобы не было лишних XML тегов -->
    <xsl:output method="text" encoding="UTF-8"/>
    <!-- Объявляем параметры -->
    <xsl:param name="fromDate" />
    <xsl:param name="toDate" />
    
    <xsl:template match="/">
[
    <xsl:for-each select="r:Report/r:TableMLM/r:Detail_Collection/r:Detail[
        translate(@DREGDATE, '-:T', '') &gt;= translate($fromDate, '-:T', '') and 
        translate(@DREGDATE, '-:T', '') &lt;= translate($toDate, '-:T', '')
    ]">
      <xsl:variable name="full" select="normalize-space(@SCONS)"/>
      <xsl:variable name="afterFirst" select="substring-after($full, ' ')"/>
      <xsl:variable name="afterSecond" select="substring-after($afterFirst, ' ')"/>
        {
          "name": "<xsl:value-of select="@SCONS"/>",
          "lastname": "<xsl:choose>
              <xsl:when test="contains($full, ' ')"><xsl:value-of select="substring-before($full, ' ')"/></xsl:when>
              <xsl:otherwise><xsl:value-of select="$full"/></xsl:otherwise>
          </xsl:choose>",
          "firstname": "<xsl:choose>
              <xsl:when test="contains($afterFirst, ' ')"><xsl:value-of select="substring-before($afterFirst, ' ')"/></xsl:when>
              <xsl:otherwise><xsl:value-of select="$afterFirst"/></xsl:otherwise>
          </xsl:choose>",
          "patronymic": "<xsl:value-of select="$afterSecond"/>"
          "regdate": "<xsl:value-of select="translate(substring(@DREGDATE, 1, 10), '-', '.')"/>",
          "email": "<xsl:value-of select="@SCONSEMAIL"/>"
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
]
    </xsl:template>
</xsl:stylesheet>
