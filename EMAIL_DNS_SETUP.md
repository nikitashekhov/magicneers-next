# Настройка SPF и DKIM для домена magicneers.com

## Проблема

Gmail блокирует письма от домена `magicneers.com`, потому что не пройдены проверки SPF и DKIM:

```
DKIM = did not pass
SPF [magicneers.com] with ip: [2a02:6b8:c41:1300:1:45:d181:d102] = did not pass
```

## Решение

Необходимо настроить SPF и DKIM записи в DNS для домена `magicneers.com`.

## Шаг 1: Настройка SPF записи

### Что такое SPF?
SPF (Sender Policy Framework) — это запись DNS, которая указывает, какие серверы могут отправлять письма от имени вашего домена.

### Настройка для Yandex

1. **Войдите в панель управления доменом** (где вы управляете DNS-записями для `magicneers.com`)

2. **Добавьте или обновите TXT запись для SPF:**

   ```
   Тип: TXT
   Имя: @ (или magicneers.com)
   Значение: v=spf1 include:_spf.yandex.net ~all
   TTL: 3600 (или по умолчанию)
   ```

   **Важно:** Если у вас уже есть SPF запись, нужно объединить её с Yandex. Например:
   ```
   v=spf1 include:_spf.yandex.net include:other-provider.com ~all
   ```

3. **Проверка SPF записи:**
   ```bash
   dig TXT magicneers.com
   # или
   nslookup -type=TXT magicneers.com
   ```

## Шаг 2: Настройка DKIM записи

### Что такое DKIM?
DKIM (DomainKeys Identified Mail) — это метод цифровой подписи писем, который подтверждает, что письмо действительно отправлено от вашего домена.

### Получение DKIM ключа от Yandex

1. **Войдите в Яндекс.Почту для домена:**
   - Перейдите на https://admin.yandex.ru/
   - Войдите в аккаунт администратора домена

2. **Перейдите в настройки почты:**
   - Откройте раздел "Почта" → "Настройки домена"
   - Найдите раздел "DKIM" или "Проверка подлинности"

3. **Создайте DKIM ключ:**
   - Нажмите "Создать ключ DKIM" или "Включить DKIM"
   - Yandex сгенерирует публичный ключ DKIM

4. **Добавьте DKIM запись в DNS:**
   
   Yandex предоставит вам запись вида:
   ```
   Тип: TXT
   Имя: mail._domainkey (или yandex._domainkey)
   Значение: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (длинный ключ)
   TTL: 3600
   ```

   **Пример полной записи:**
   ```
   Имя: mail._domainkey.magicneers.com
   Тип: TXT
   Значение: v=DKIM1; k=rsa; p=ВАШ_ПУБЛИЧНЫЙ_КЛЮЧ_ОТ_YANDEX
   ```

## Шаг 3: Настройка DMARC (опционально, но рекомендуется)

DMARC (Domain-based Message Authentication, Reporting & Conformance) — это политика, которая определяет, что делать с письмами, которые не прошли SPF/DKIM проверки.

### Добавьте DMARC запись:

```
Тип: TXT
Имя: _dmarc
Значение: v=DMARC1; p=quarantine; rua=mailto:dmarc@magicneers.com; ruf=mailto:dmarc@magicneers.com; pct=100
TTL: 3600
```

**Параметры:**
- `p=quarantine` — помещать письма в карантин (можно использовать `none` для начала)
- `rua` — email для получения отчетов (замените на ваш email)
- `ruf` — email для получения отчетов о неудачных проверках

## Шаг 4: Проверка настроек

### Онлайн-инструменты для проверки:

1. **MXToolbox SPF Checker:**
   https://mxtoolbox.com/spf.aspx
   - Введите `magicneers.com`
   - Проверьте, что SPF запись найдена и корректна

2. **MXToolbox DKIM Checker:**
   https://mxtoolbox.com/dkim.aspx
   - Введите `magicneers.com` и селектор (обычно `mail` или `yandex`)
   - Проверьте, что DKIM запись найдена

3. **Mail Tester:**
   https://www.mail-tester.com/
   - Отправьте тестовое письмо на указанный адрес
   - Получите детальный отчет о всех проверках

4. **Google Postmaster Tools:**
   https://postmaster.google.com/
   - Добавьте домен `magicneers.com`
   - Проверьте статус SPF и DKIM через несколько дней

## Шаг 5: Ожидание распространения DNS

После добавления DNS записей:
- **Обычно:** 5-30 минут
- **Максимум:** до 48 часов (TTL записи)

## Шаг 6: Проверка отправки письма

После настройки DNS записей:

1. Отправьте тестовое письмо с `info@magicneers.com` на Gmail адрес
2. Проверьте заголовки письма в Gmail:
   - Откройте письмо
   - Нажмите "Показать оригинал" (Show original)
   - Найдите строки:
     - `SPF: PASS` или `SPF: SOFTFAIL`
     - `DKIM: PASS`

## Примеры DNS записей для magicneers.com

```
# SPF запись
@                    TXT    v=spf1 include:_spf.yandex.net ~all

# DKIM запись (селектор зависит от Yandex)
mail._domainkey      TXT    v=DKIM1; k=rsa; p=YOUR_YANDEX_DKIM_KEY

# DMARC запись
_dmarc               TXT    v=DMARC1; p=quarantine; rua=mailto:dmarc@magicneers.com
```

## Альтернативное решение: Использование SendGrid или другого email сервиса

Если настройка SPF/DKIM через Yandex вызывает сложности, можно использовать специализированные email сервисы:

1. **SendGrid** — https://sendgrid.com/
2. **Mailgun** — https://www.mailgun.com/
3. **Amazon SES** — https://aws.amazon.com/ses/
4. **Resend** — https://resend.com/

Эти сервисы предоставляют:
- Готовые SPF и DKIM записи
- Высокую доставляемость писем
- API для интеграции
- Детальную аналитику

## Документация Yandex

- [Настройка DKIM для Яндекс.Почты для домена](https://yandex.ru/support/connect/mail/dkim.html)
- [Настройка SPF для Яндекс.Почты для домена](https://yandex.ru/support/connect/mail/spf.html)

## Полезные команды для проверки

```bash
# Проверка SPF
dig TXT magicneers.com

# Проверка DKIM (замените mail на ваш селектор)
dig TXT mail._domainkey.magicneers.com

# Проверка DMARC
dig TXT _dmarc.magicneers.com

# Проверка MX записей
dig MX magicneers.com
```

## Контакты поддержки

Если возникли проблемы:
1. **Yandex Поддержка:** https://yandex.ru/support/connect/
2. **Ваш DNS провайдер** (где настроены DNS записи домена)

---

**Важно:** После настройки DNS записей подождите несколько часов и проверьте отправку тестового письма. Gmail может кэшировать результаты проверок.
