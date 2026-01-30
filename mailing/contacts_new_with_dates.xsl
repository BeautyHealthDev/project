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
{
    <xsl:for-each select="r:Report/r:TableMLM/r:Detail_Collection/r:Detail[@DREGDATE &gt;= $fromDate and @DREGDATE &lt;= $toDate]">
        {
          "name": "<xsl:value-of select="SCONS"/>",
          "reg-date": "<xsl:value-of select="DREGDATE"/>",
          "email": "<xsl:value-of select="SCONSEMAIL"/>"          
        }<xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
}
    </xsl:template>
</xsl:stylesheet>
