package com.example.demo.services;

import com.example.demo.domain.Bucket;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.mapper.reflect.ConstructorMapper;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Service
public class BucketService {

    private final Jdbi jdbi;
    @Inject
    public BucketService(DataSource dataSource) {
        this.jdbi = Jdbi.create(dataSource)
                .registerRowMapper(ConstructorMapper.factory(Bucket.class));
    }

    public Bucket createBucket(Bucket bucket) {
        return this.jdbi.inTransaction(h -> h.createUpdate("""
                        insert into buckets(id, name, project_id)
                        values (:id, :name, :projectId)""")
                .bindMethods(bucket)
                .executeAndReturnGeneratedKeys()
                .mapTo(Bucket.class)
                .one()
        );
    }

    public Optional<Bucket> readBucket(String bucketId) {
        return this.jdbi.withHandle( h -> h
                .createQuery("select * from buckets where id = :id")
                .bind("id", bucketId)
                .mapTo(Bucket.class)
                .findFirst()
        );
    }

    public List<Bucket> readBuckets(){
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from buckets")
                .mapTo(Bucket.class)
                .list()
        );
    }

    public Optional<Bucket> updateBucket(Bucket bucket) {
        return this.jdbi.withHandle(h -> (
                h.createUpdate("""
                    update buckets
                    set (name) = (:name)
                    where id = :id""")
        )
                .bindMethods(bucket)
                .executeAndReturnGeneratedKeys()
                .mapTo(Bucket.class)
                .findFirst());
    }

    public boolean deleteBucket(String bucketId) {
        return this.jdbi.withHandle( h ->
                h.createUpdate("delete from buckets where id = :id")
                        .bind("id", bucketId)
                        .execute()
                        > 0
        );
    }
    public List<Bucket> readFromProjectId(String id) {
        return this.jdbi.withHandle(h -> h
                .createQuery("select * from buckets where project_id = :id")
                .bind("id", id)
                .mapTo(Bucket.class)
                .list()
        );
    }
}
