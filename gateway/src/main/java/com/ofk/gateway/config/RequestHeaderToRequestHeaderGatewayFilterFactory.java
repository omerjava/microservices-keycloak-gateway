package com.ofk.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class RequestHeaderToRequestHeaderGatewayFilterFactory
        extends AbstractGatewayFilterFactory<RequestHeaderToRequestHeaderGatewayFilterFactory.Config> {

    public RequestHeaderToRequestHeaderGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return exchange.getPrincipal()
                    .cast(Authentication.class)
                    .flatMap(authentication -> {
                        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
                        ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate();

                        config.getHeaders().forEach((headerName, claimExpression) -> {
                            String value = jwtAuth.getToken().getClaimAsString("sub"); // or parse claimExpression dynamically
                            requestBuilder.header(headerName, value);
                        });

                        return chain.filter(exchange.mutate().request(requestBuilder.build()).build());
                    });
        };
    }

    // ✅ Configuration class
    public static class Config {
        private Map<String, String> headers;

        public Map<String, String> getHeaders() {
            return headers;
        }

        public void setHeaders(Map<String, String> headers) {
            this.headers = headers;
        }
    }
}

