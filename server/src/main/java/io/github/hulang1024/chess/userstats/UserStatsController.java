package io.github.hulang1024.chess.userstats;

import io.github.hulang1024.chess.http.GuestAPI;
import io.github.hulang1024.chess.http.params.PageParam;
import io.github.hulang1024.chess.http.results.PageRet;
import io.github.hulang1024.chess.user.SearchUserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
@GuestAPI
public class UserStatsController {
    @Autowired
    private UserStatsService userStatsService;

    @GetMapping("/ranking")
    public ResponseEntity<PageRet<SearchUserInfo>> searchRanking(@Validated SearchRankingParam param, PageParam pageParam) {
        return ResponseEntity.ok( userStatsService.searchRanking(param, pageParam) );
    }
}