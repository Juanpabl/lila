package lila.app
package templating

import java.util.concurrent.ConcurrentHashMap
import play.api.i18n.Lang
import java.time.format.{ FormatStyle, DateTimeFormatter }
import java.time.{ Duration, LocalDate }

import lila.app.ui.ScalatagsTemplate.*
import lila.i18n.PeriodLocales

trait DateHelper:
  self: I18nHelper with StringHelper with NumberHelper =>

  export PeriodLocales.showDuration

  private val dateTimeFormatters = new ConcurrentHashMap[String, DateTimeFormatter]
  private val dateFormatters     = new ConcurrentHashMap[String, DateTimeFormatter]

  private val englishDateTimeFormatter =
    DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM, FormatStyle.SHORT)
  private val englishDateFormatter =
    DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM)

  private def dateTimeFormatter(using lang: Lang): DateTimeFormatter =
    dateTimeFormatters.computeIfAbsent(
      lang.code,
      _ =>
        DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM, FormatStyle.SHORT).withLocale(lang.toLocale)
    )

  private def dateFormatter(using lang: Lang): DateTimeFormatter =
    dateFormatters.computeIfAbsent(
      lang.code,
      _ => DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM).withLocale(lang.toLocale)
    )

  def showInstant(instant: Instant)(using Lang): String =
    dateTimeFormatter print instant

  def showDate(instant: Instant)(using Lang): String =
    showDate(instant.date)

  def showDate(date: LocalDate)(using lang: Lang): String =
    if lang.language == "ar"
    then dateFormatter.print(date).replaceAll("\u200f", "")
    else dateFormatter print date

  def showEnglishDate(instant: Instant): String    = englishDateFormatter print instant
  def showEnglishInstant(instant: Instant): String = englishDateTimeFormatter print instant

  def semanticDate(instant: Instant)(using lang: Lang): Tag =
    timeTag(datetimeAttr := isoDateTime(instant))(showDate(instant))

  def semanticDate(date: LocalDate)(using lang: Lang): Tag =
    timeTag(datetimeAttr := isoDateTime(date.atStartOfDay.instant))(showDate(date))

  def showMinutes(minutes: Int)(using Lang): String =
    showDuration(Duration.ofMinutes(minutes))

  def isoDateTime(instant: Instant): String = isoDateTimeFormatter print instant

  private val oneDayMillis = 1000 * 60 * 60 * 24

  def momentFromNow(instant: Instant, alwaysRelative: Boolean = false, once: Boolean = false): Tag =
    if !alwaysRelative && (instant.toMillis - nowMillis) > oneDayMillis then absClientInstant(instant)
    else timeTag(cls := s"timeago${once so " once"}", datetimeAttr := isoDateTime(instant))(nbsp)

  def momentFromNowWithPreload(
      instant: Instant,
      alwaysRelative: Boolean = false,
      once: Boolean = false
  ): Frag =
    momentFromNow(instant, alwaysRelative, once)(momentFromNowServerText(instant))

  def absClientInstant(instant: Instant): Tag =
    timeTag(cls := "timeago abs", datetimeAttr := isoDateTime(instant))("-")

  def momentFromNowOnce(instant: Instant): Tag = momentFromNow(instant, once = true)

  def secondsFromNow(seconds: Int, alwaysRelative: Boolean = false): Tag =
    momentFromNow(nowInstant plusSeconds seconds, alwaysRelative)

  def momentFromNowServer(instant: Instant)(using Lang): Frag =
    timeTag(title := f"${showInstant(instant)} UTC")(momentFromNowServerText(instant))

  def momentFromNowServerText(instant: Instant, inFuture: Boolean = false): String =
    val (dateSec, nowSec) = (instant.toMillis / 1000, nowSeconds)
    val seconds           = (if inFuture then dateSec - nowSec else nowSec - dateSec).toInt atLeast 0
    val minutes           = seconds / 60
    val hours             = minutes / 60
    val days              = hours / 24
    lazy val weeks        = days / 7
    lazy val months       = days / 30
    lazy val years        = days / 365
    val preposition       = if inFuture then " from now" else " ago"
    if minutes == 0 then "right now"
    else if hours == 0 then s"${pluralize("minute", minutes)}$preposition"
    else if days < 2 then s"${pluralize("hour", hours)}$preposition"
    else if weeks == 0 then s"${pluralize("day", days)}$preposition"
    else if months == 0 then s"${pluralize("week", weeks)}$preposition"
    else if years == 0 then s"${pluralize("month", months)}$preposition"
    else s"${pluralize("year", years)}$preposition"
