// Warning: For use in servers only.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <poll.h>
#include <arpa/inet.h>

#define MAX_FDS 1024
#define BUF_SIZE 4096
#define LISTENERS 3

struct client {
    int fd;
    int local_port;
    struct sockaddr_in peer;
};

static int make_listener(int port) {
    int fd;
    int yes = 1;
    struct sockaddr_in addr;

    fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) {
        perror("socket");
        exit(1);
    }

    setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(port);

    if (bind(fd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind");
        exit(1);
    }

    if (listen(fd, 128) < 0) {
        perror("listen");
        exit(1);
    }

    return fd;
}

static void dump_payload(const char *buf, ssize_t len) {
    ssize_t i;
    for (i = 0; i < len; i++) {
        unsigned char c = buf[i];
        if (c >= 32 && c <= 126)
            putchar(c);
        else
            putchar('.');
    }
}

int main(void) {
    struct pollfd fds[MAX_FDS];
    struct client clients[MAX_FDS];
    int nfds = 0;
    char buf[BUF_SIZE];
    int ports[] = {9101, 9102, 9103};
    int i;

    for (i = 0; i < LISTENERS; i++) {
        int fd = make_listener(ports[i]);
        fds[nfds].fd = fd;
        fds[nfds].events = POLLIN;
        clients[nfds].fd = fd;
        clients[nfds].local_port = ports[i];
        nfds++;
    }

    for (;;) {
        int ret = poll(fds, nfds, -1);
        if (ret < 0) {
            if (errno == EINTR)
                continue;
            perror("poll");
            exit(1);
        }

        for (i = 0; i < nfds; i++) {
            if (!(fds[i].revents & POLLIN))
                continue;

            if (i < LISTENERS) {
                struct sockaddr_in peer;
                socklen_t len = sizeof(peer);
                int cfd = accept(fds[i].fd, (struct sockaddr *)&peer, &len);
                if (cfd < 0)
                    continue;

                if (nfds < MAX_FDS) {
                    fds[nfds].fd = cfd;
                    fds[nfds].events = POLLIN;
                    clients[nfds].fd = cfd;
                    clients[nfds].local_port = clients[i].local_port;
                    clients[nfds].peer = peer;
                    nfds++;
                } else {
                    close(cfd);
                }
            } else {
                ssize_t n = read(fds[i].fd, buf, sizeof(buf));
                if (n <= 0) {
                    close(fds[i].fd);
                    fds[i] = fds[nfds - 1];
                    clients[i] = clients[nfds - 1];
                    nfds--;
                    i--;
                    continue;
                }

                printf(
                    "from %s:%d -> port %d (%zd bytes): ",
                    inet_ntoa(clients[i].peer.sin_addr),
                    ntohs(clients[i].peer.sin_port),
                    clients[i].local_port,
                    n
                );
                dump_payload(buf, n);
                putchar('\n');
                fflush(stdout);
            }
        }
    }
}
