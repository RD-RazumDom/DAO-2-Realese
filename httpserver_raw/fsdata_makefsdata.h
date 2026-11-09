#ifndef __FSDATA_MAKEFSDATA_H__
#define __FSDATA_MAKEFSDATA_H__

#include <stdint.h>
#include <assert.h>

typedef uint8_t  u8_t;
typedef uint16_t u16_t;
typedef uint32_t u32_t;
typedef int8_t   s8_t;
typedef int16_t  s16_t;
typedef int32_t  s32_t;

#ifndef TCP_MSS
#define TCP_MSS 1460
#endif

#ifndef LWIP_ASSERT
#define LWIP_ASSERT(msg, expr) assert(expr)
#endif

#ifndef LWIP_UNUSED_ARG
#define LWIP_UNUSED_ARG(x) (void)(x)
#endif

#ifndef HTTPD_SERVER_AGENT
#define HTTPD_SERVER_AGENT "lwIP/1.4.1 (http://savannah.nongnu.org/projects/lwip)"
#endif

#define LWIP_HTTPD_DYNAMIC_HEADERS 1
#define LWIP_HTTPD_SSI             1

typedef struct
{
  const char *extension;
  int headerIndex;
} tHTTPHeader;

static const char * const g_psHTTPHeaderStrings[] =
{
 "Content-type: text/html\r\n\r\n",
 "Content-type: text/html\r\nExpires: Fri, 10 Apr 2008 14:00:00 GMT\r\nPragma: no-cache\r\n\r\n",
 "Content-type: image/gif\r\n\r\n",
 "Content-type: image/png\r\n\r\n",
 "Content-type: image/jpeg\r\n\r\n",
 "Content-type: image/bmp\r\n\r\n",
 "Content-type: image/x-icon\r\n\r\n",
 "Content-type: application/octet-stream\r\n\r\n",
 "Content-type: application/x-javascript\r\n\r\n",
 "Content-type: application/x-javascript\r\n\r\n",
 "Content-type: text/css\r\n\r\n",
 "Content-type: application/x-shockwave-flash\r\n\r\n",
 "Content-type: text/xml\r\n\r\n",
 "Content-type: text/plain\r\n\r\n",
 "HTTP/1.0 200 OK\r\n",
 "HTTP/1.0 404 File not found\r\n",
 "HTTP/1.0 400 Bad Request\r\n",
 "HTTP/1.0 501 Not Implemented\r\n",
 "HTTP/1.1 200 OK\r\n",
 "HTTP/1.1 404 File not found\r\n",
 "HTTP/1.1 400 Bad Request\r\n",
 "HTTP/1.1 501 Not Implemented\r\n",
 "Content-Length: ",
 "Connection: Close\r\n",
 "Connection: keep-alive\r\n",
 "Server: "HTTPD_SERVER_AGENT"\r\n",
 "\r\n<html><body><h2>404: The requested file cannot be found.</h2></body></html>\r\n"
};

#define HTTP_HDR_HTML           0
#define HTTP_HDR_SSI            1
#define HTTP_HDR_GIF            2
#define HTTP_HDR_PNG            3
#define HTTP_HDR_JPG            4
#define HTTP_HDR_BMP            5
#define HTTP_HDR_ICO            6
#define HTTP_HDR_APP            7
#define HTTP_HDR_JS             8
#define HTTP_HDR_RA             9
#define HTTP_HDR_CSS            10
#define HTTP_HDR_SWF            11
#define HTTP_HDR_XML            12
#define HTTP_HDR_DEFAULT_TYPE   13
#define HTTP_HDR_OK             14
#define HTTP_HDR_NOT_FOUND      15
#define HTTP_HDR_BAD_REQUEST    16
#define HTTP_HDR_NOT_IMPL       17
#define HTTP_HDR_OK_11          18
#define HTTP_HDR_NOT_FOUND_11   19
#define HTTP_HDR_BAD_REQUEST_11 20
#define HTTP_HDR_NOT_IMPL_11    21
#define HTTP_HDR_CONTENT_LENGTH 22
#define HTTP_HDR_CONN_CLOSE     23
#define HTTP_HDR_CONN_KEEPALIVE 24
#define HTTP_HDR_SERVER         25
#define DEFAULT_404_HTML        26

const static tHTTPHeader g_psHTTPHeaders[] =
{
 { "html", HTTP_HDR_HTML},
 { "htm",  HTTP_HDR_HTML},
 { "shtml",HTTP_HDR_SSI},
 { "shtm", HTTP_HDR_SSI},
 { "ssi",  HTTP_HDR_SSI},
 { "gif",  HTTP_HDR_GIF},
 { "png",  HTTP_HDR_PNG},
 { "jpg",  HTTP_HDR_JPG},
 { "bmp",  HTTP_HDR_BMP},
 { "ico",  HTTP_HDR_ICO},
 { "class",HTTP_HDR_APP},
 { "cls",  HTTP_HDR_APP},
 { "js",   HTTP_HDR_JS},
 { "ram",  HTTP_HDR_RA},
 { "css",  HTTP_HDR_CSS},
 { "swf",  HTTP_HDR_SWF},
 { "xml",  HTTP_HDR_XML},
 { "xsl",  HTTP_HDR_XML}
};

#define NUM_HTTP_HEADERS (sizeof(g_psHTTPHeaders) / sizeof(tHTTPHeader))

static const char * const g_pcSSIExtensions[] = {
  ".shtml", ".shtm", ".ssi", ".xml"
};
#define NUM_SHTML_EXTENSIONS (sizeof(g_pcSSIExtensions) / sizeof(const char *))

#endif /* __FSDATA_MAKEFSDATA_H__ */